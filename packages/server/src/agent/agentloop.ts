import { GoogleGenAI } from "@google/genai";
import { executeFunction, tool } from "./tools";
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface loop {
  type: "USER" | "ASSISTANT" | "ERROR";
  content: string;
  mode: "BUILD" | "PLAN";
}

export async function runloop({ type, content, mode }: loop) {
  const messages: any[] = [{ role: "user", parts: [{ text: content }] }];
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        systemInstruction: "your a cli agent like claude code",
        tools: mode === "BUILD" ? [{ functionDeclarations: tool }] : [],
      },
    });

    console.log(
      "----------------------------row ai respone ----------------------------",
      result,
    );

    const parts = result.candidates![0]?.content?.parts;

    console.log(
      "----------------------------parts ai respone ----------------------------",
      parts,
    );

    const functionCall = parts?.find((p) => p.functionCall);
    if (!functionCall) {
      return parts?.find((p) => p.text)?.text;
    }

    const c = functionCall.functionCall;
    const toolResult = await executeFunction(c?.name!, c?.args!);

    messages.push({ role: "model", parts });
    messages.push({
      role: "user",
      parts: [{ functionResponse: { name:c?.name ,response: { result: toolResult } } }],
    });
  }
}
