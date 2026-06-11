import { Hono } from 'hono'
import {streamText} from "ai"
import { createGoogleGenerativeAI } from '@ai-sdk/google';
const app = new Hono()

const googleAi = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
})

app.get('/sessions', async(c) => {

  const data = streamText({
    model: googleAi("gemini-2.5-flash"),
    system: "test",
    prompt: "What is the capital of France? what is the history behind it explain in detail?",
  })
 for await(const d of data.toUIMessageStream()){
  console.log(d)
 }
           
return  data.toUIMessageStreamResponse()
})

export default {port: 3000, fetch: app.fetch, idleTimeout:255 } 


