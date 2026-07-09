import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { prisma } from "@nightcode/database";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { Role, Mode } from "@nightcode/database/enums";
import { runloop } from "../agent/agentloop";

const CreateSessionSchema = z.object({
  title: z.string(),
  cwd: z.string().optional(),
  initialMessage: z.object({
    type: z.nativeEnum(Role),
    content: z.string(),
    mode: z.nativeEnum(Mode),
  }),
});

const CreateMessageSchema = z.object({
  content: z.string(),
  mode: z.nativeEnum(Mode),
});

const CreateSessionSchemaValidator = zValidator(
  "json",
  CreateSessionSchema,
  (result, c) => {
    if (!result.success) {
      return c.json("wrong input body", 400);
    }
  },
);

const CreateMessageSchemaValidator = zValidator(
  "json",
  CreateMessageSchema,
  (result, c) => {
    if (!result.success) {
      return c.json("wrong input body", 400);
    }
  },
);

const sessionRouter = new Hono()
  .post("/", CreateSessionSchemaValidator, async (c) => {
    const { initialMessage, ...data } = c.req.valid("json");

    const session = await prisma.session.create({
      data: {
        title: data.title,
        cwd: data.cwd ?? "",
        userId: "ss",
        messages: {
          create: {
            ...initialMessage,
          },
        },
      },
    });
    console.log("chat created ---------------------");

    return c.json({message:"chat created",session})
     
  })
  .post("/:id/messages", CreateMessageSchemaValidator, async (c) => {
    const { id } = c.req.param();
    const { content, mode } = c.req.valid("json");

    const session = await prisma.session.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    
    return streamText(c,async(stream)=>{
      const d = await runloop({type:"USER",content,mode},async(chunk)=>{
        stream.write(JSON.stringify(chunk)+"\n")
      })

      await prisma.message.create({
      data: {
        sessionId: id,
        type: Role.USER,
        content: content,
        mode: mode,
      },
    });

    await prisma.message.createMany({
      data: d.map((m)=>({...m,sessionId:id,mode:mode}))
    });

    })
  })
  .get("/", async (c) => {
    const data = await prisma.session.findFirst({
      where: {
        userId: "ss",
      },
    });
    return c.json(data);
  });

export default sessionRouter;
