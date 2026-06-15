import { useLocation, useNavigate } from "react-router";

import { useEffect, useRef } from "react";
import { ErrorMessage, UserMessage, BotMessage } from "../component/messages";
import { SessionShell } from "../component/session-shell";
import apiClient from "../lib/api-client"
import z from "zod";

const messageSchema = z.object({
  text: z.string()
})

export function NewSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const requestRef = useRef(false)
  const parsedState = messageSchema.safeParse(location.state);

  useEffect(() => {

    if (requestRef.current || !parsedState.success) return
    requestRef.current = true
    const text = parsedState.data.text
    const data = apiClient.session.$post({
      json: {
        title: text.slice(0, 40)!,
        cwd: process.cwd(),
        initialMessage: {
          type: "USER",
          content: text,
          mode: "BUILD"
        }
      }
    })
  }, [])


   useEffect(() => {
    if (!parsedState.success) {
      navigate("/", { replace: true });
    }
  }, [parsedState.success, navigate]);

  if (!parsedState.success) return null;

  return (
    <SessionShell onSubmit={() => { }} inputDisable loading>
      <UserMessage message={parsedState.data.text} />
      <BotMessage content="hello from bot" model="opus" />
      <ErrorMessage message="oops" />
    </SessionShell>

  )
}