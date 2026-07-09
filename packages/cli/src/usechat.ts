import apiClient from "./lib/api-client";
import type { StreamResponse } from "./screens/session";
type ChatMessage = (data: StreamResponse) => void;

type dataType = {
  id: string;
  content: string;
  mode: "BUILD" | "PLAN";
};

export async function useChat(data: dataType, onData: ChatMessage) {
  const response = await apiClient.session[":id"].messages.$post({
    param: {
      id: data.id,
    },
    json: {
      content: data.content,
      mode: data.mode,
    },
  });
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    let buffer = decoder.decode(value, { stream: true });
const lines = buffer.split("\n")
buffer = lines.pop() ?? ""; // keep incomplete line
    for(const line of lines){
      if(!line) return
      const parsedData = JSON.parse(line)
      onData(parsedData)
    }
  }
}
