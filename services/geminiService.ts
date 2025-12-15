import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (name: string, category: string, keywords: string): Promise<string> => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY is not set. Returning placeholder.");
    return "API Key missing. Unable to generate description.";
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