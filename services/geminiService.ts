
import { GoogleGenAI, Type } from "@google/genai";

// Refactored to initialize GoogleGenAI inside functions for dynamic API key updates
export async function parseExpensePrompt(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this expense description: "${prompt}". Extract description, amount, and suggest a category.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          category: { type: Type.STRING },
        },
        required: ["description", "amount", "category"]
      }
    }
  });

  const text = response.text;
  if (!text) return null;

  try {
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
}

export async function getSpendingAdvice(expenses: any[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these recent expenses: ${JSON.stringify(expenses)}, give a 1-sentence financial insight or tip.`,
  });
  return response.text;
}
