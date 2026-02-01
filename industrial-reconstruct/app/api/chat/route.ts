import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const message = formData.get("message") as string;
        // const historyJson = formData.get("history") as string;
        // const history = JSON.parse(historyJson || "[]");
        const imageCount = parseInt(formData.get("imageCount") as string) || 0;

        // Collect all images
        const images: { data: string; mimeType: string }[] = [];
        for (let i = 0; i < imageCount; i++) {
            const file = formData.get(`file${i}`) as File | null;
            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                const base64Data = Buffer.from(arrayBuffer).toString("base64");
                images.push({
                    data: base64Data,
                    mimeType: file.type || "image/png",
                });
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        // Debug: Single turn only. Just the prompt and images.
        const contentParts: any[] = [{ text: message }];

        // Attach images
        for (const img of images) {
            contentParts.push({
                inlineData: {
                    data: img.data,
                    mimeType: img.mimeType,
                },
            });
        }

        const result = await model.generateContent(contentParts);
        const response = await result.response;
        console.log("Gemini API Response:", JSON.stringify(result, null, 2));
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Error processing chat request:", error);

        return NextResponse.json({
            response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
}
