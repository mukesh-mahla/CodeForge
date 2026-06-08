import type { DialogContextValue } from "../provider/dialog"
import type { DialogConfig } from "../provider/dialog/types"
import type { ToastContextValue } from "../provider/toast"

export type contextType = {
    exit:()=>void
    toast:ToastContextValue
    dialog:DialogContextValue
}


export type commandType = {
    name:string,
    description:string,
    value:string,
    action?:(ctx:contextType)=>void | Promise<void>
}