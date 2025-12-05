import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

// Initialize the API client
// CRITICAL: The API key must be available in process.env.API_KEY
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/png;base64,") to get just the base64 string
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sends images and a prompt to the Gemini model for editing/generation.
 */
export const generateEditedImage = async (
  prompt: string,
  images: UploadedImage[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';

    const parts: any[] = [];

    // 1. Add images to the payload
    for (const img of images) {
        // Ensure we have base64 data
        let base64Data = img.base64;
        if (!base64Data) {
            base64Data = await fileToBase64(img.file);
        }
        
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: img.mimeType
            }
        });
    }

    // 2. Add the text prompt
    parts.push({
        text: prompt
    });

    // 3. Call the API
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      }
    });

    // 4. Extract the image from the response
    // The model might return text and image parts. We need to find the image.
    let generatedImageUrl: string | null = null;
    
    if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content && content.parts) {
            for (const part of content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                    break; 
                }
            }
        }
    }

    if (!generatedImageUrl) {
        throw new Error("The model did not return an image. It might have refused the request or returned only text.");
    }

    return generatedImageUrl;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
