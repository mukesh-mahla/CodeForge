import { tool } from "ai";
import z from "zod";

import { readFileSync } from "fs";

const readFile = tool({
    description:"read a file",
    inputSchema:z.object({
        path:z.string()
    }),
    execute:async({path})=>{
      const result =  readFileSync(path,"utf-8")
      return {result}
    }
})


export const Tools = {
    read_file:readFile
}
