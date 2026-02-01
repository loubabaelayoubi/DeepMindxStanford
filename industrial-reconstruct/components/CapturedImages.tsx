"use client";

import { X, Trash2, Image as ImageIcon } from "lucide-react";

interface CapturedImagesProps {
    images: string[]; // base64 images
    onRemove: (index: number) => void;
    onClearAll: () => void;
    maxImages?: number;
}

export default function CapturedImages({
    images,
    onRemove,
    onClearAll,
    maxImages = 6,
}: CapturedImagesProps) {
    return (
        <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ImageIcon size={18} className="text-gray-500" />
                    <span className="font-medium text-sm text-gray-700">
                        {images.length}/{maxImages} Captures
                    </span>
                </div>
                {images.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                        <Trash2 size={12} />
                        Clear
                    </button>
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {images.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No captures yet</p>
                        <p className="text-xs mt-1">Press ⌘⇧S to capture</p>
                    </div>
                ) : (
                    images.map((img, index) => (
                        <div
                            key={index}
                            className="relative group bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`data:image/png;base64,${img}`}
                                alt={`Capture ${index + 1}`}
                                className="w-full aspect-video object-cover"
                            />
                            <button
                                onClick={() => onRemove(index)}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <X size={12} />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {index + 1}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Capacity indicator */}
            {images.length > 0 && images.length < maxImages && (
                <div className="p-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        {maxImages - images.length} more captures available
                    </div>
                </div>
            )}
        </div>
    );
}
