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
        mode: z.nativeEnum(Mode)
    })
})

const CreateSessionSchemaValidator = zValidator("json", CreateSessionSchema, (result, c) => {
    if (!result.success) {
        return c.json("wrong input body", 400)
    }
})

const sessionRouter = new Hono()
    .post("/", CreateSessionSchemaValidator, async (c) => {
        
        const { initialMessage, ...data } = c.req.valid("json")
      

        const session = await prisma.session.create({
            data: {
                title: data.title,
                cwd: data.cwd ?? "",
                userId: "ss",
                messages: {
                    create: {
                        ...initialMessage
                    }
                },
            }
        })
        console.log("chat created ---------------------")

        
        const p = runloop(initialMessage)  

        return c.json({ message: "session created successfully", session }, 201)
    })
    .get("/", async (c) => {
        const data = await prisma.session.findFirst({
            where: {
                userId: "ss"
            }
        })
        return c.json(data)
    })

export default sessionRouter;
