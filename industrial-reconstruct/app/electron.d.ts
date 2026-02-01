// TypeScript declarations for Electron APIs exposed via preload
export interface ElectronAPI {
    platform: string;
    onScreenshotCaptured: (callback: (base64: string) => void) => void;
    removeScreenshotListener: () => void;
    manualCapture: () => Promise<string | null>;
    getPlatform: () => Promise<string>;
}

declare global {
    interface Window {
        electron?: ElectronAPI;
    }
}

export { };
