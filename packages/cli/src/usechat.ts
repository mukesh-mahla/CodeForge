type ChatMessage = {
  onData: (data: string) => void;
};

export async function useChat({ onData }: ChatMessage) {
  const response = await fetch("http://localhost:3000/sessions");
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
     
    onData(chunk);
  }
}
