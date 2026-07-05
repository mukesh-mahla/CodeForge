import { GoogleGenAI, type Part } from "@google/genai";
import { executeFunction, tool } from "./tools";
import type { Role } from "@nightcode/database/enums";
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface loop {
  type: "USER" | "ASSISTANT" | "ERROR";
  content: string;
  mode: "BUILD" | "PLAN";
}

type GeminiMessageType = {
  role: string;
  parts: Part[];
};

type DbMessageType = {
  type: Role;
  content: string;
};

export async function runloop({ type, content, mode }: loop) {
  const messages: GeminiMessageType[] = [
    { role: "user", parts: [{ text: content }] },
  ];
  const dbMessage: DbMessageType[] = [];
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        systemInstruction:
          "your a cli agent like claude code, you might be working in a codebase or you are being used to create one , so use the tool to create and read the codebase , you are a cross-platform coding agent, if your action doesnt work then try other way ",
        tools: mode === "BUILD" ? [{ functionDeclarations: tool }] : [],
      },
    });

    console.log(
      "----------------------------row ai respone ----------------------------",
      result,
    );

    const parts = result.candidates![0]?.content?.parts ?? [];

    console.log(
      "----------------------------parts ai respone ----------------------------",
      parts,
    );

    messages.push({ role: "model", parts });

    const functionCall = parts?.find((p) => p.functionCall);
    if (!functionCall) {
      const text = parts.find((p) => p.text)?.text ?? "";
      dbMessage.push({ type: "ASSISTANT", content: text });
      break;
    }
    const c = functionCall.functionCall;
    const toolResult = await executeFunction(c?.name!, c?.args!);

    messages.push({
      role: "user",
      parts: [
        {
          functionResponse: { name: c?.name, response: { result: toolResult } },
        },
      ],
    });
  }

  return dbMessage;
}
