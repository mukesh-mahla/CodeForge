import { TextareaRenderable, TextAttributes, type KeyBinding } from "@opentui/core"
import { CommandMenu } from "./command-menu"
import { useState, useRef, useEffect, useCallback } from "react"
import { useKeyboard, useRenderer } from "@opentui/react"
import { useCommandMenu } from "./command-menu/use-command-menu"
import type { commandType } from "./command-menu/types"
import { useToast } from "./provider/toast"
import { useKeyboardContext } from "./provider/keyboard"
import { useDialog } from "./provider/dialog"
import { useTheme } from "./provider/theme"




interface inputProps {
    disabled?: boolean
    onSubmit: (text: string) => void
}

export const TEXTAREA_KEYBINDINGS: KeyBinding[] = [
    { name: "return", action: "submit" },
    { name: "enter", action: "submit" },
    { name: "return", shift: true, action: "newline" },
    { name: "return", shift: true, action: "newline" }
]

export function Input({ disabled = false, onSubmit }: inputProps) {
    const {colors} = useTheme()
    const textArearef = useRef<TextareaRenderable>(null)
    const onSubmitRef = useRef<() => void>(() => { })
    const renderer = useRenderer()
    const toast = useToast()
    const { selectedIndex, showMenu, resolveCommand, scrollRef, setselectedIndex, CommandQuery, handleContentChange } = useCommandMenu()
    const { isTop, setResponder } = useKeyboardContext()
const dialog = useDialog()

    const handletextareaContentChange = useCallback(() => {
        const textarea = textArearef.current
        if (!textarea) return
        handleContentChange(textarea.plainText)
    }, [])

    const handleSubmit = useCallback(() => {
        const textarea = textArearef.current
        if (!textarea || disabled) {
            return
        }
        const text = textarea.plainText.trim()
        if (text.length === 0) return
        onSubmit(text)
    }, [])

    const handleCommand = useCallback((command: commandType | undefined) => {
        const textarea = textArearef.current

        if (!textArearef || !command) return

        textarea?.setText("")
        if (command.action) {
            command.action({
                exit: () => renderer.destroy(),
                toast,
                dialog
            })
        } else {
            textarea?.insertText(command.value + " ")
        }
    }, [renderer, toast])
    const handleCommandExecute = useCallback((index: number) => {
        const command = resolveCommand(index)
        handleCommand(command)
    }, [resolveCommand, handleCommand])

    useEffect(() => {
        const textarea = textArearef.current
        if (!textarea) {
            return
        }
        textarea.onSubmit = () => {
            onSubmitRef.current()
        }
    }, [])


    onSubmitRef.current = () => {
        if (disabled) return
        if (showMenu) {
            const command = resolveCommand(selectedIndex)
            handleCommand(command)
            return
        }
        handleSubmit()
    }

    useEffect(() => {
        setResponder("base", () => {
            if (disabled) return false

            const textarea = textArearef.current
            if (textarea && textarea.plainText.length > 0) {
                textarea.setText("")
                return true
            }
            return false
        })
        return () => setResponder("base", null)
    }, [disabled, setResponder])


    return <box alignItems="center" width={"100%"}>
        <box border={["left"]} borderColor={colors.primary} borderStyle="heavy" width={"100%"} >
            <box position="relative" justifyContent="center" backgroundColor={colors.surface} gap={1} width={"100%"} paddingX={2} paddingY={1} >
                {showMenu && (
                    <box position="absolute"
                        bottom={"100%"}
                        left={0}
                        width={"100%"}
                        backgroundColor={colors.surface}
                        zIndex={10}
                    >
                        <CommandMenu query={CommandQuery} selectedIndex={selectedIndex} scrollRef={scrollRef} onSelect={setselectedIndex} onExecute={handleCommandExecute} />
                    </box>
                )}
                <textarea onContentChange={handletextareaContentChange} ref={textArearef}
                    focused={!disabled && (isTop("base") || isTop("command"))}
                    keyBindings={TEXTAREA_KEYBINDINGS} placeholder={"start a new project  ... fix a bug in a file"} />
                <Statusbar />

            </box>
        </box>
    </box>
}


function Statusbar() {
    const {colors} = useTheme()
    return <box flexDirection="row" gap={1}   >
        <text fg={colors.primary}>Build</text>
        <text>{">"}</text>
        <text attributes={TextAttributes.DIM}  fg={colors.dimSeparator}>opus-4-6</text>
    </box>
}