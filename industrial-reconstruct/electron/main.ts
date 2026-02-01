// Electron main process
import { app, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, nativeImage, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#ffffff',
        titleBarStyle: 'hiddenInset',
        frame: true,
    });

    // Load the Next.js app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load from the built Next.js output
        mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

async function captureScreen(): Promise<string | null> {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length === 0) {
            console.error('No screen sources found');
            return null;
        }

        // Get the primary display
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        // Find the source that matches the primary display, or use the first one
        const source = sources.find(s => s.display_id === primaryDisplay.id.toString()) || sources[0];

        // The thumbnail is already captured, convert to base64
        const thumbnail = source.thumbnail;

        // Resize to a reasonable size for API
        const resized = thumbnail.resize({ width: Math.min(width, 1920) });
        const base64 = resized.toDataURL().replace(/^data:image\/png;base64,/, '');

        // Also save locally for debugging
        const screenshotsDir = path.join(app.getPath('userData'), 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filepath = path.join(screenshotsDir, `screenshot_${timestamp}.png`);
        fs.writeFileSync(filepath, resized.toPNG());

        console.log(`Screenshot saved to: ${filepath}`);

        return base64;
    } catch (error) {
        console.error('Error capturing screen:', error);
        return null;
    }
}

function registerGlobalShortcuts() {
    // Cmd+Shift+S (macOS) or Ctrl+Shift+S (Windows/Linux) for full screen capture
    const screenshotShortcut = process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S';

    const registered = globalShortcut.register(screenshotShortcut, async () => {
        console.log(`${screenshotShortcut} pressed - capturing screen...`);

        const base64 = await captureScreen();

        if (base64 && mainWindow) {
            // Send the captured screenshot to the renderer
            mainWindow.webContents.send('screenshot-captured', base64);

            // Bring the window to focus
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    if (!registered) {
        console.error(`Failed to register global shortcut: ${screenshotShortcut}`);
    } else {
        console.log(`Global shortcut registered: ${screenshotShortcut}`);
    }
}

// IPC Handlers
ipcMain.handle('get-platform', () => process.platform);

ipcMain.handle('manual-capture', async () => {
    const base64 = await captureScreen();
    return base64;
});

app.whenReady().then(() => {
    createWindow();
    registerGlobalShortcuts();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
});
