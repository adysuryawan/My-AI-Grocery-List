
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiGroceryItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "A list of grocery items with their categories.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the ingredient, e.g., 'All-purpose flour'."
          },
          category: {
            type: Type.STRING,
            description: "The category of the ingredient, e.g., 'Pantry', 'Produce', 'Dairy', 'Meat'."
          }
        },
        required: ["name", "category"]
      }
    }
  },
  required: ["items"]
};

export const generateGroceryList = async (userPrompt: string): Promise<GeminiGroceryItem[]> => {
  try {
    const prompt = `Based on the following cooking plan, generate a detailed list of grocery ingredients. Categorize each ingredient. The plan is: "${userPrompt}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && Array.isArray(parsed.items)) {
        return parsed.items as GeminiGroceryItem[];
    } else {
        console.error("Unexpected JSON structure:", parsed);
        return [];
    }
  } catch (error) {
    console.error("Error generating grocery list:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
