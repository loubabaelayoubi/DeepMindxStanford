// Electron preload script
import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer via contextBridge
contextBridge.exposeInMainWorld('electron', {
    // Platform info
    platform: process.platform,

    // Listen for screenshot captured events from main process
    onScreenshotCaptured: (callback: (base64: string) => void) => {
        ipcRenderer.on('screenshot-captured', (_event, base64: string) => {
            callback(base64);
        });
    },

    // Remove screenshot listener
    removeScreenshotListener: () => {
        ipcRenderer.removeAllListeners('screenshot-captured');
    },

    // Manually trigger a capture (if wanted from UI)
    manualCapture: async (): Promise<string | null> => {
        return ipcRenderer.invoke('manual-capture');
    },

    // Get platform
    getPlatform: async (): Promise<string> => {
        return ipcRenderer.invoke('get-platform');
    },
});
