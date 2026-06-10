import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { DEFAULT_TOAST_DURATION, type ToastOptions, type ToastVarient } from "./type";
import { useTerminalDimensions } from "@opentui/react";
import { useTheme } from "../theme";



export type ToastContextValue = {
    show: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
    const value = useContext(ToastContext)
    if (!value) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return value
}

type ToastProviderProps = {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null)
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null)
    const clearcurrentTimeout = useCallback(() => {
        if (timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current)
            timeoutHandleRef.current = null
            
        }

    }, [])
    const show = useCallback((option: ToastOptions) => {
        const duration = option.duration ?? DEFAULT_TOAST_DURATION
        clearcurrentTimeout()

        setCurrentToast({
            varient: option.varient ?? "info",
            ...option,
            duration
        })

        timeoutHandleRef.current = setTimeout(() => {
            setCurrentToast(null)
        }, duration).unref()
    }, [clearcurrentTimeout])
    const value: ToastContextValue = {
        show
    }

    return <ToastContext.Provider value={value}>
        {children}
        <Toast currentToast={currentToast} />
    </ToastContext.Provider>
}


type ToastProps = {
    currentToast?: ToastOptions | null
}

function Toast({ currentToast }: ToastProps) {
const {colors} = useTheme()
    const { width } = useTerminalDimensions()

    if (!currentToast) return null

    const varientColor: Record<ToastVarient, string> = {
        success: colors.success,
        error: colors.error,
        info: colors.info
    }

    const borderColor = currentToast.varient ? varientColor[currentToast.varient] : varientColor.info
    return (
        <box
            position="absolute"
            alignItems="center"
            justifyContent="flex-start"
            top={2}
            right={2}
            width={Math.max(1, Math.min(60, width - 6))}
            paddingBottom={1}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            backgroundColor={colors.surface}
            borderColor={borderColor}
            border={["left", "right"]}
        >
            <box flexDirection="column" gap={1} width={"100%"}>
                <text fg="E1E1E1" wrapMode="word" width={"100%"}>{currentToast.message}</text>
            </box>
        </box>
    )
}