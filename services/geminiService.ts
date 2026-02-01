
import { GoogleGenAI, Type } from "@google/genai";
import { SOPData } from "../types";

export const analyzeIndustrialScreenshot = async (base64Image: string): Promise<SOPData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are a senior Industrial Engineer specializing in process optimization and legacy system migration.
    Analyze the attached screenshot from an industrial software interface (MES, ERP, QMS, or similar).
    
    Tasks:
    1. Identify the core process being performed.
    2. Determine the role of the operator.
    3. Reconstruct the operational sequence.
    4. Highlight compliance and safety risks.
    
    If the image is not legacy industrial software (e.g., a modern design site), treat it as a 'System Navigation Training' process for that specific UI.
    
    Output the result in strict JSON format based on the following schema:
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.OBJECT,
        properties: {
          processName: { type: Type.STRING },
          role: { type: Type.STRING },
          systemType: { type: Type.STRING },
          goal: { type: Type.STRING }
        },
        required: ["processName", "role", "systemType", "goal"]
      },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            check: { type: Type.STRING },
            risk: { type: Type.STRING }
          },
          required: ["check", "risk"]
        }
      },
      checklist: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      loomScript: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            step: { type: Type.STRING },
            narration: { type: Type.STRING },
            focus: { type: Type.STRING }
          },
          required: ["step", "narration", "focus"]
        }
      }
    },
    required: ["overview", "steps", "risks", "checklist", "loomScript"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as SOPData;
};
