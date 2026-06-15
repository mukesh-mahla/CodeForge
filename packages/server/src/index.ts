import { Hono } from "hono";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { HTTPException } from "hono/http-exception";
import sessionRouter from "./routes/sessions";
const app = new Hono();

const googleAi = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});


app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        error: error.message || "Request failed",
      },
      error.status,
    );
  }
  console.error("Unhandled error", error);
  return c.json({ error: "internal server error" }, 500);
});

const routes = app.route("/session",sessionRouter)

export type Apptype = typeof routes

export default { port: 3000, fetch: app.fetch, idleTimeout: 255 };
