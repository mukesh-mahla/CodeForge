import { createContext, useCallback, useContext, useState, type Dispatch } from "react"
import type { DialogConfig } from "./types"
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react"
import { useKeyboardContext } from "../keyboard"
import { RGBA, TextAttributes } from "@opentui/core"

export type DialogContextValue = {
    open:(config:DialogConfig)=>void
    close:()=>void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({children}:{children:React.ReactNode}){
    
const [dialogData, setDialogData] = useState<DialogConfig | null>(null)

const {push,pop} = useKeyboardContext()

const close = useCallback(()=>{
       setDialogData(null)
       pop("dialog")
},[])

const open = useCallback((data:DialogConfig)=>{
        setDialogData(data)
        push("dialog",()=>{
            close()
            return true
        })
},[push,close])
   
    return <DialogContext.Provider value={{open,close}}>
        {children}
        <Dialog  data={dialogData!} close={close} />
    </DialogContext.Provider>
}

export const useDialog = ()=>{
    const value  = useContext(DialogContext)
    if(!value){
        throw new Error("component must be in a Dialog Provider")
    }
    return value
}


function Dialog({data,close}:{data:DialogConfig | null, close:()=>void}){
    const {isTop} = useKeyboardContext()
    const dimensions = useTerminalDimensions()
    useKeyboard((key)=>{
        if(!data || !isTop("dialog")) return
        if(key.name === "escape"){
            close()
        }
    })

    if(!data) return null
    const {title,children} = data

            return <box position="absolute"
            left={0}
            top={0}
            width={dimensions.width}
            height={dimensions.height}
            justifyContent="center"
            alignItems="center"
            backgroundColor={RGBA.fromInts(0,0,0,150)}
            zIndex={100}
            onMouseDown={()=>close()}
            >
                <box
                width={Math.min(60,dimensions.width-4)}
                height={"auto"}
                backgroundColor={"#1c1b1c"}
                paddingX={4}
                paddingY={1}
                flexDirection="column"
                gap={1}
                onMouseDown={(e)=>e.stopPropagation()}
>
    <box paddingBottom={1} flexDirection="row" alignItems="center" justifyContent="space-between">
        <text attributes={TextAttributes.DIM}>{title}</text>
        <text attributes={TextAttributes.DIM} onMouseDown={()=>close()} >esc</text>
    </box>
    <box flexGrow={1}>{children}</box>

                </box>

            </box>
      
}