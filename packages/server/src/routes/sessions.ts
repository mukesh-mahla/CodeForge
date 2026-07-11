import { Hono } from "hono";
import { stream, streamText } from "hono/streaming";
import { prisma } from "@nightcode/database";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { Role, Mode } from "@nightcode/database/enums";
import { runloop, type loop } from "../agent/agentloop";

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

    return c.json({ message: "chat created", session });
  })
  .post("/:id/messages", async (c) => {
    const { id } = c.req.param();

    const session = await prisma.session.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const lastMessage = session.messages.map((m) => ({
      role: m.type as Role,
      content: m.content,
    }));
    const lastMessageMode = session.messages[0]?.mode!;
    return streamText(c, async (stream) => {
      const d = await runloop(
        lastMessage,
        lastMessageMode,
        session.cwd,
        async (chunk) => {
          stream.write(JSON.stringify(chunk) + "\n");
        },
      );

      await prisma.message.createMany({
        data: d.dbMessage.map((m) => ({
          ...m,
          sessionId: id,
          mode: lastMessageMode,
        })),
      });
      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          cwd: d.newCwd,
        },
      });
    });
  })
  .post("/:id/messages/followup",CreateMessageSchemaValidator, async (c) => {
    const { id } = c.req.param();
    const { mode, content } =  c.req.valid("json");
    const session = await prisma.session.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    await prisma.message.create({
      data: {
        sessionId: id,
        content: content,
        type: "USER",
        mode,
      },
    });

    const messages: loop[] = [
      ...session.messages,
      { type: "USER", content: content, mode: mode },
    ].map((m) => ({ role: m.type as Role, content: m.content }));

    return stream(c, async (stream) => {
      const d = await runloop(messages, mode, session.cwd, async (chunk) => {
        stream.write(JSON.stringify(chunk) + "\n");
      });

      await prisma.message.createMany({
        data: d.dbMessage.map((m) => ({ ...m, sessionId: id, mode: mode })),
      });

      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          cwd: d.newCwd,
        },
      });
    });
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
