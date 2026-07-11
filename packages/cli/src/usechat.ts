import type { ClientResponse } from "hono/client";
import apiClient from "./lib/api-client";
import type { StreamResponse } from "./screens/session";
import type { StatusCode } from "hono/utils/http-status";
type ChatMessage = (data: StreamResponse) => void;

type dataType = {
  id: string;
  content: string;
  mode: "BUILD" | "PLAN";
};

export async function useChat(data: dataType, onData: ChatMessage,firstMessage:boolean) {
  if(firstMessage){
    const response = await apiClient.session[":id"].messages.$post({
    param: {
      id: data.id,
    },
  });
 return handleStream(response,onData)
  }

  const response = await apiClient.session[":id"].messages.followup.$post({
    param:{
      id:data.id
    },
    json:{
      mode:data.mode,
      content:data.content
    }
  })
 return handleStream(response,onData)
}

async function handleStream(response: ClientResponse<{}, StatusCode, string>,onData: ChatMessage){
 const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = ""
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep incomplete line
    for (const line of lines) {
      if (!line) continue;
      const parsedData = JSON.parse(line);
      onData(parsedData);
    }
  }
}
