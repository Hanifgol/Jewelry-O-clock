import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (name: string, category: string, keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. Returning placeholder.");
    return "API Key missing. Unable to generate description.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
