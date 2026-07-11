import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { ErrorMessage, UserMessage, BotMessage } from "../component/messages";
import { SessionShell } from "../component/session-shell";

import z from "zod";
import { useChat } from "../usechat";


const messageSchema = z.object({
  text: z.string()
})

export type StreamResponse = {
  type: "TOLL_RESULT" | "FUNCTION_CALL" | "TEXT"
  name?: string,
  result?: string,
  args?: Record<string, any>,
  content?: string
}

export function Session() {
  const navigate = useNavigate()
  const location = useLocation()
  const param = useParams()
  const requestRef = useRef(false)
  const parsedState = messageSchema.safeParse(location.state);
  const [chunks, setChunks] = useState<StreamResponse[]>([])

  function handleUI(chunk: StreamResponse) {
    setChunks(prev => [...prev, chunk])
  }

  useEffect(() => {
    if (requestRef.current || !parsedState.success || !param.id) return
    requestRef.current = true
    const text = parsedState.data.text
    useChat({ id: param.id, mode: "BUILD", content: text }, handleUI,true)
  }, [])


  useEffect(() => {
    if (!parsedState.success) {
      navigate("/", { replace: true });
    }
  }, [parsedState.success, navigate]);

  if (!parsedState.success) return null;

  const HandleSubmit = (text:string)=>{
      useChat({id:param.id!,mode:"BUILD",content:text},handleUI,false)
  }

  return (
    <SessionShell onSubmit= {(text)=> HandleSubmit(text)} inputDisable loading>
      <UserMessage message={parsedState.data.text} />
      {chunks.map((chunk, i) => {
        if (chunk.type === "TEXT") return <BotMessage key={i} content={chunk.content!} model="gemini" />
        if (chunk.type === "FUNCTION_CALL") return <text key={i} fg="grey"> → {chunk.name}...{chunk.args?.path ?? chunk.args?.command ?? ""}</text>
        if (chunk.type === "TOLL_RESULT") return <text key={i} fg="green"> ✓ {chunk.name}</text>
      })}
      <ErrorMessage message="oops" />
    </SessionShell>
  )
}