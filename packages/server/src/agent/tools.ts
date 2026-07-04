import { Type } from "@google/genai";

const readFile = {
  
  name: "read_file",
  description: "read a file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description: "path for the specific file",
      },
    },
    required: ["path"],
  },
};

const writeFile = {
  
  name: "write_file",
  description: "write in a file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description: "path for the specific file",
      },
      content: {
        type: Type.STRING,
        description: "content that needs to written in that file",
      },
    },
    required: ["path", "content"],
  },
};

const usebash = {
  
  name: "use_bash",
  description: "use bash for running a command",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: "command that needs to run",
      },
    },
    required: ["command"],
  },
};

export const tool = [readFile, writeFile, usebash];

export async function executeFunction(name: string, args: Record<string, any>) {
  if (name === "read_file") {
    const res = Bun.file(args.path);
    const result = await res.text();
    return result;
  } else if (name === "write_file") {
    await Bun.write(args.path, args.content);
    return "written succesfully";
  } else if (name === "use_bash") {
    const proc = Bun.spawnSync(["bash", "-c", args.command]);
    return proc.stdout.toString();
  }
  return "unknown tool";
}
