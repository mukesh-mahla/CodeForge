

import { GoogleGenAI } from "@google/genai"
import { Tools } from "./tools";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function runloop(query:string) {
 
    const result = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:query,
        config:{
            toolConfig:{
                
            }
            tools:Tools
        }
    })

    for (const call of result.toolCalls) {
  const tool = Tools[call.toolName];
  
  const result = await tool.execute(call.input, {
    toolCallId: call.toolCallId,
            // the current message history, for tools that need context
    abortSignal: undefined, // or a real AbortController signal if you want cancellation
  });

  // ...
}
    
}


