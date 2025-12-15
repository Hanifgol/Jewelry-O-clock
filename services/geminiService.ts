import { GoogleGenAI } from "@google/genai";

// Safe access to environment variables in various build environments (Vite, Webpack, etc.)
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // @ts-ignore - Vite specific handling
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return null;
};

export const generateProductDescription = async (name: string, category: string, keywords: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("API_KEY is not set. Returning placeholder.");
    return "API Key missing. Unable to generate description. Please configure VITE_API_KEY in your environment.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const prompt = `
      Write a luxurious, captivating, and short product description (max 2 sentences) for a piece of jewelry.
      Product Name: ${name}
      Category: ${category}
      Keywords/Features: ${keywords}
      Tone: Elegant, Premium, Sophisticated.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Description generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};