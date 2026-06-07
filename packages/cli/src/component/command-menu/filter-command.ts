import { COMMANDS } from "./command";
import type { commandType } from "./types";


export function FilterCommand(query:string):commandType[]{
    if(!query) return COMMANDS;
    return COMMANDS.filter((cmd)=>cmd.name.toLowerCase().startsWith(query.toLowerCase()))
}