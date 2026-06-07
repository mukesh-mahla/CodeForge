import { type commandType } from "./types"
export const COMMANDS:commandType[] = [
    {
        name:"new",
        description:"start a new chat",
        value:"/new"
    },
    {
        name:"agents",
        description:"switch agent",
        value:"/agents"
    },
    {
        name:"theme",
        description:"Change color theme",
        value:"/logout"
    },
    {
        name:"models",
        description:"Select AI model for generation",
        value:"/models"
    },
    {
        name:"session",
        description:"Browse past session",
        value:"/session"
    },
    {
        name:"theme",
        description:"Change color theme",
        value:"/logout"
    },
    {
        name:"login",
        description:"Signin to your account",
        value:"/login"
    },
    {
        name:"logout",
        description:"Sign out of your account",
        value:"/logout"
    },
    {
        name:"upgrade",
        description:"Buy more credits",
        value:"/upgrade"
    },
    {
        name:"usage",
        description:"Open billing portal in your browser",
        value:"/usage"
    },
    {
        name:"exit",
        description:"exit menu",
        value:"/exit",
        action:(ctx)=>{
            ctx.exit()
        }
    },
]