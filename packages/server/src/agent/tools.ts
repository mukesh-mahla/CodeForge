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
  description: "use bash for running a command, whichever you think is needed",
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
    console.log(args);
    const proc =
      process.platform === "win32"
        ? Bun.spawnSync(["cmd", "/c", args.command])
        : Bun.spawnSync(["bash", "-c", args.command]);
    console.log(proc.stdout.toString());
    console.log(proc.stderr.toString());
    console.log(proc.exitCode);
    if (proc.exitCode !== 0) {
      return `Command failed:
${proc.stderr.toString()}`;
    }
    return proc.stdout.toString();
  }
  return "unknown tool";
}
