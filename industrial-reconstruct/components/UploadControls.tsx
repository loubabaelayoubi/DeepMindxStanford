"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { ReconstructionResult } from "@/app/types";

interface UploadControlsProps {
    images: string[]; // base64 images
    onReconstruct: (data: ReconstructionResult) => void;
}

export default function UploadControls({ images, onReconstruct }: UploadControlsProps) {
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReconstruct = async () => {
        if (images.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            // Add each image as a separate blob
            for (let i = 0; i < images.length; i++) {
                const base64 = images[i];
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let j = 0; j < byteCharacters.length; j++) {
                    byteNumbers[j] = byteCharacters.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
                formData.append(`file${i}`, blob, `screenshot_${i + 1}.png`);
            }

            formData.append("context", context);
            formData.append("imageCount", images.length.toString());

            const res = await fetch("/api/reconstruct", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to reconstruct workflow");
            }

            const data = await res.json();
            onReconstruct(data);
        } catch (err) {
            setError("Error processing images. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in duration-200">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-xl">
                <div className="text-center mb-4">
                    <p className="text-lg font-medium text-gray-900">
                        {images.length} screenshot{images.length !== 1 ? 's' : ''} ready
                    </p>
                    <p className="text-sm text-gray-500">
                        Ready to generate SOP
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                            Context (Optional)
                        </label>
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Describe the overall workflow..."
                            className="w-full text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        onClick={handleReconstruct}
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Analyzing {images.length} image{images.length !== 1 ? 's' : ''}...
                            </>
                        ) : (
                            <>
                                Generate SOP
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
