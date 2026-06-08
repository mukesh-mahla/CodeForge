import { useKeyboard, useRenderer } from "@opentui/react"
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"

type Responder = () => boolean

type keyboardcontextvalue = {
    push: (id: string,responder:Responder) => void
    pop: (id: string) => void
    setResponder: (id: string, responder: Responder | null) => void
    isTop: (id: string) => boolean
}

const keyboardcontext = createContext<keyboardcontextvalue | null>(null)

export function KeyboardProvider({children}:{children: ReactNode}) {
    const [cureentStack, setCurrentStack] = useState<string[]>(["base"])
    const responderRef = useRef<Map<string, Responder>>(new Map())
    const renderer = useRenderer()
    const push = useCallback((id: string, responder?: Responder) => {
        if (responder) {
            responderRef.current.set(id, responder)
        }
        setCurrentStack((prev) => {
            if (prev.includes(id)) {
                return prev
            } else {
                return [...prev, id]
            }
        })
    }, [])

    const pop = useCallback((id: string) => {
        responderRef.current.delete(id)
        setCurrentStack((prev) => prev.filter((layer) => layer !== id))
    }, [])

    const isTop = useCallback((id: string) => {
        return cureentStack.length === 0 || cureentStack[cureentStack.length - 1] === id
    }, [cureentStack])

    const setResponder = useCallback((id: string, responder: Responder | null) => {
        if (responder) {
            responderRef.current.set(id, responder)
        } else {
            responderRef.current.delete(id)
        }
    }, [])


    useKeyboard((key) => {
        if (key.name !== "c" && key.ctrl === false) return

        for (let i = cureentStack.length - 1; i >= 0; i--) {
            const id = cureentStack[i]
            const responder = responderRef.current.get(id!)
            if (responder && responder()) {
                return;
            }
        }
        renderer.destroy()
    })

 return <keyboardcontext.Provider value={{push,pop,isTop,setResponder}}>
    {children}
 </keyboardcontext.Provider>
}

 export const useKeyboardContext = ()=>{
 const value = useContext(keyboardcontext)
 if(!value){
    throw new Error("you must wrap your component in the keyBoard Provider")
 }
 return value
}