"use client";

import { useState, useEffect } from "react";
import CapturedImages from "@/components/CapturedImages";
import UploadControls from "@/components/UploadControls";
import OutputSection from "@/components/OutputSection";
import ChatAssistant from "@/components/ChatAssistant";
import { ReconstructionResult } from "@/app/types";
import { Keyboard, FileText, MessageSquare } from "lucide-react";

const MAX_IMAGES = 6;
type Mode = 'sop' | 'chat';

export default function Home() {
  const [images, setImages] = useState<string[]>([]); // base64 images
  const [data, setData] = useState<ReconstructionResult | null>(null);
  const [mode, setMode] = useState<Mode>('sop');
  const [isElectron, setIsElectron] = useState(false);

  // Check if running in Electron and set up screenshot listener
  useEffect(() => {
    const electronAvailable = typeof window !== 'undefined' && window.electron;
    setIsElectron(!!electronAvailable);

    if (electronAvailable && window.electron) {
      // Listen for screenshots captured via global hotkey
      window.electron.onScreenshotCaptured((base64: string) => {
        console.log('Screenshot captured via hotkey!');
        setImages(prev => {
          if (prev.length < MAX_IMAGES) {
            return [...prev, base64];
          }
          return prev; // Max reached
        });
      });

      return () => {
        window.electron?.removeScreenshotListener();
      };
    }
  }, []);

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setImages([]);
    setData(null);
  };

  // Smooth scroll to output when data is available (only in SOP mode)
  useEffect(() => {
    if (data && mode === 'sop') {
      setTimeout(() => {
        const outputElement = document.getElementById("output");
        if (outputElement) {
          const y = outputElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 500);
    }
  }, [data, mode]);

  return (
    <div className="h-screen flex bg-white font-sans text-gray-900">
      {/* Left Sidebar - Captured Images */}
      <CapturedImages
        images={images}
        onRemove={handleRemoveImage}
        onClearAll={handleClearAll}
        maxImages={MAX_IMAGES}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header with Mode Toggle */}
        <header className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Industrial Reconstruct
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
              WORKFLOW RECONSTRUCTION ENGINE
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode('sop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'sop'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <FileText size={16} />
              Generate SOP
            </button>
            <button
              onClick={() => setMode('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'chat'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <MessageSquare size={16} />
              Assistant
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white p-6 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10 w-full h-full flex flex-col items-center">

            {/* Empty State / Keyboard Hint */}
            {images.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="mb-8 flex items-center justify-center gap-3 text-gray-400">
                  <Keyboard size={24} strokeWidth={1.5} />
                  <span className="text-lg font-light">
                    Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono text-sm mx-1">⌘⇧S</kbd> to capture
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Reconstruct</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Capture screenshots of your industrial workflow to generate SOPs or ask the AI assistant for analysis.
                </p>
              </div>
            )}

            {/* SOP Mode */}
            {mode === 'sop' && images.length > 0 && (
              !data ? (
                <div className="w-full h-full flex items-center justify-center">
                  <UploadControls
                    images={images}
                    onReconstruct={setData}
                  />
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto py-8">
                  <OutputSection data={data} />
                </div>
              )
            )}

            {/* Chat Mode */}
            {mode === 'chat' && images.length > 0 && (
              <div className="w-full h-full flex items-center justify-center py-4">
                <ChatAssistant images={images} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
