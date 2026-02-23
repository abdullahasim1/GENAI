import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeJsonParse } from "@/lib/hf";

function getGeminiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
}

export function hasGeminiConfig() {
  return Boolean(getGeminiKey());
}

function getGeminiModelName() {
  return process.env.GEMINI_MODEL || "gemini-1.5-flash";
}

function getGeminiClient() {
  const key = getGeminiKey();
  if (!key) {
    throw new Error("Missing GEMINI_API_KEY / GOOGLE_API_KEY.");
  }
  return new GoogleGenerativeAI(key);
}

export async function geminiGenerateJson(
  prompt: string,
  systemInstruction: string
) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: getGeminiModelName(),
    systemInstruction,
  });

  const result = await model.generateContent(prompt);

  const text = result.response.text();
  return safeJsonParse(text);
}

