import type { Apptype } from "@nightcode/server";
import { hc } from "hono/client";

const client = hc<Apptype>(process.env.API_URL ?? "http://localhost:3000");

export default client;
