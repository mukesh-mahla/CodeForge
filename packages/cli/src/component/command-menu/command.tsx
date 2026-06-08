import { ThemeDialogContent } from "../dialogs"
import { type commandType } from "./types"
export const COMMANDS:commandType[] = [
    {
        name:"new",
        description:"start a new chat",
        value:"/new",
        action:(ctx)=>{
            ctx.toast.show({message:"starting a new conversation"})
            
        }
    },
    {
        name:"agents",
        description:"switch agent",
        value:"/agents",
        action:(ctx)=>{
            ctx.dialog.open({title:"Select Agent",children:<text>Agent selection coming soon ...</text>})
        }
    },
    {
        name:"theme",
        description:"Change color theme",
        value:"/theme",
        action:(ctx)=>{
            ctx.dialog.open({title:"select theme",children:<ThemeDialogContent/>})
        }
    },
    {
        name:"models",
        description:"Select AI model for generation",
        value:"/models",
        action:(ctx)=>{
            ctx.dialog.open({title:"select model",children:<text>models coming soon...</text>})
        }
    },
    {
        name:"session",
        description:"Browse past session",
        value:"/session"
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