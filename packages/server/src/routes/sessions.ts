import { Hono } from "hono";
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

    const Airesponse = await runloop(initialMessage);

   const d =  await prisma.message.createMany({
      data:Airesponse.map((m)=>({...m,sessionId:session.id,mode:initialMessage.mode}))
    })
    console.log("svaed in the db -----------------------------------------------",d)

    return c.json({ message: "session created successfully", session }, 201);
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

    // Add the user's new message to the session
    const userMessage = await prisma.message.create({
      data: {
        sessionId: id,
        type: Role.USER,
        content: content,
        mode: mode,
      },
    });

    // Prepare messages for the AI agent, including previous messages if needed for context
    // For simplicity, let's just pass the new message for now, but this should be extended
    // to pass the full conversation history if the AI needs it for context.
    const aiResponseContent = await runloop({
      type: Role.USER,
      content: content,
      mode: mode,
    });

    // Store the AI's response
    const aiMessage = await prisma.message.create({
      data: {
        sessionId: id,
        type: Role.ASSISTANT, // Assuming the AI's response is from the assistant
        content:  "No response from AI", // Handle cases where AI might not return content
        mode: mode,
      },
    });

    return c.json(
      { message: "Message sent and AI responded", userMessage, aiMessage },
      201,
    );
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
