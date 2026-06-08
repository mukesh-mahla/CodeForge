import { Box, TextAttributes, type InputRenderable, type ScrollBoxRenderable } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { useCallback, useRef, useState, type ReactNode } from "react"
import { useKeyboardContext } from "./provider/keyboard"
import { useTheme } from "./provider/theme"

const MAX_VISIBLE_HEIGHT = 6

type DialogSearchListProps<T> = {
    items: T[]
    onSelect: (item: T) => void
    onHighlight?: (item: T) => void
    filterfn: (item: T, query: string) => boolean
    renderItem: (item: T, isSelected: boolean) => ReactNode
    getKey: (item: T) => string
    placeholder?: string
    emptyText: string
}

export function DialogSearchList<T>({ items, onSelect, onHighlight,
    filterfn,
    renderItem,
    getKey,
    placeholder = "Search",
    emptyText = "No results"
}: DialogSearchListProps<T>) {
    const {colors} = useTheme()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [textValue, setTextvalue] = useState("")
    const InputRef = useRef<InputRenderable>(null)
    const scrollBoxRef = useRef<ScrollBoxRenderable>(null)
    const { isTop } = useKeyboardContext()
    const handleContentChange = useCallback(() => {
        const textarea = InputRef.current
        if (!textarea) return
        const text = textarea.plainText
        setTextvalue(text)
        setSelectedIndex(0)

        const scrollBox = scrollBoxRef.current
        if (scrollBox) {
            scrollBox.scrollTo(0)
        }
    }, [])

    const filterd = textValue ? items.filter((item) => filterfn(item, textValue)) : items

    useKeyboard((key) => {
        if (!isTop("dialog")) return

        if (key.name === "return" || key.name === "enter") {
            const item = filterd[selectedIndex]
            if (item) {
                onSelect(item)
            }
        } else if (key.name === "up") {
            setSelectedIndex((prev) => {

                const newIndex = Math.max(prev - 1, 0)
                const scrollBox = scrollBoxRef.current
                if (scrollBox && newIndex < scrollBox?.scrollTop) {
                    scrollBox.scrollTo(newIndex)
                }

                const item = filterd[newIndex]
                if (item && onHighlight) {
                    onHighlight(item)
                }
                return newIndex
            })
        } else if (key.name === "down") {
            setSelectedIndex((prev) => {
                const newIndex = Math.min(prev + 1, items.length - 1)
                const scrollBox = scrollBoxRef.current
                if (scrollBox) {
                    const viewportHeight = scrollBox.viewport.height
                    const visibleHeight = scrollBox.scrollTop + viewportHeight - 1
                    if (newIndex > visibleHeight) {
                        scrollBox.scrollTo(newIndex)
                    }
                }
                const item = filterd[newIndex]
                if (item && onHighlight) {
                    onHighlight(item)
                }

                return newIndex
            })
        }
    })

    return <box flexDirection="column" gap={1}>
     <input
     ref={InputRef}
     placeholder={placeholder}
     focused
     onContentChange={handleContentChange}
     />
     {filterd.length === 0 ? (
        <text attributes={TextAttributes.DIM}>{emptyText}</text>
     ):(
        <scrollbox ref={scrollBoxRef} height={MAX_VISIBLE_HEIGHT}>
              {filterd.map((item,i)=>{
                const isSelected = i === selectedIndex
                return (
                    <box
                    key={getKey(item)}
                    flexDirection="row"
                    height={1}
                    overflow="hidden"
                    backgroundColor={isSelected?colors.selection:"#262526"}
                    onMouseMove={()=>{
                        setSelectedIndex(i)
                        if(onHighlight)onHighlight(item)
                    }}
                onMouseDown={()=>{
                    onSelect(item)
                }}
                    >
{renderItem(item,isSelected)}
                    </box>
                )
              })}
        </scrollbox>
     )}
    </box>
}

