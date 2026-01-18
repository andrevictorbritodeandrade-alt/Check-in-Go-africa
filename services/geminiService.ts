import { GoogleGenAI } from "@google/genai";

// Use the key provided in the configuration or fall back to env var
const API_KEY = "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8akkXJR94Vg" || process.env.API_KEY;

let ai: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Gemini client:", error);
}

export async function generateText(prompt: string) {
  if (!ai) {
    console.warn("Gemini AI instance is not initialized (Missing API Key).");
    return "Serviço de IA indisponível no momento. Verifique sua chave de API.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error('Erro ao gerar texto com Gemini:', error);
    return "Desculpe, tive um problema ao conectar com a inteligência artificial.";
  }
}