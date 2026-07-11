import { Type } from "@google/genai";
import { mkdir } from "node:fs/promises";
import path from "path";
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

const UpdateFile = {
  name: "update_file",
  description: "update in a file",
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        description: "path for the specific file",
      },
      OldContent: {
        type: Type.STRING,
        description: "content that needs to be replaced",
      },
      newContent: {
        type: Type.STRING,
        description: "new content the overwrite the old content",
      },
    },
    required: ["path", "OldContent", "newContent"],
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

export const tool = [readFile, writeFile, UpdateFile, usebash];

export async function executeFunction(
  name: string,
  args: Record<string, any>,
  cwd: string,
) {
  if (name === "read_file") {
    const filePath = path.resolve(cwd, args.path);
    const res = Bun.file(filePath);
    if (!(await res.exists())) {
      return {
        output: `File not found: ${filePath}`,
        cwd,
      };
    }
    const result = await res.text();
    return { output: result };
  } else if (name === "write_file") {
    const filePath = path.resolve(cwd, args.path);

    await mkdir(path.dirname(filePath), {
      recursive: true,
    });
    await Bun.write(filePath, args.content);

    return {
      output: "written succesfully",
    };
  } else if (name === "update_file") {
    const filePath = path.resolve(cwd, args.path);
    const file = await Bun.file(filePath).text();
    if (!file.includes(args.OldContent)) {
      return {
        output: "Old content not found",
        cwd,
      };
    }

    const occurrences = file.split(args.OldContent).length - 1;

    if (occurrences !== 1) {
      return {
        output: `Expected 1 match but found ${occurrences}`,
        cwd,
      };
    }
    const update = file.replace(args.OldContent, args.newContent);

    await Bun.write(filePath, update);
    return { output: "updated succefully" };
  } else if (name === "use_bash") {
    const command: string = args.command;
    if (command.startsWith("cd ")) {
      const target = command.slice(3).trim();
      const newCwd = path.resolve(cwd, target);
      const stat = await Bun.file(newCwd).stat();

      if (!stat || !stat.isDirectory()) {
        return {
          output: `Directory does not exist: ${target}`,
          cwd,
        };
      }

      return { output: `cwd is changed to ${newCwd}`, cwd: newCwd };
    }
    console.log(args);

    const proc =
      process.platform === "win32"
        ? Bun.spawnSync(["cmd", "/c", args.command], {
            cwd: cwd,
          })
        : Bun.spawnSync(["bash", "-c", args.command], { cwd });

    console.log(proc.stdout.toString());
    console.log(proc.stderr.toString());
    console.log(proc.exitCode);

    if (proc.exitCode !== 0) {
      return {
        output: `Command failed:${proc.stderr.toString()}`,
      };
    }
    return { output: proc.stdout.toString() };
  }
  return { output: "unknown tool" };
}
