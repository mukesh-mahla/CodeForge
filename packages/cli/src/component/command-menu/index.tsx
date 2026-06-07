import type { RefObject } from "react"

import {  TextAttributes, type ScrollBoxRenderable } from "@opentui/core"
import { FilterCommand } from "./filter-command"
import { COMMANDS } from "./command"

export const MAX_VISIBLE_COMMAND = 8
export const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map(c=>c.name.length))+4

type CommandMenuProps={
 query:string
 selectedIndex:number
 scrollRef:RefObject<ScrollBoxRenderable | null>
 onSelect:(index:number)=>void
 onExecute:(index:number)=>void
}


export function CommandMenu({query,selectedIndex,scrollRef,onExecute,onSelect}:CommandMenuProps){
    const filterdCommand = FilterCommand(query)
    const visibleHeight = Math.min(filterdCommand.length,MAX_VISIBLE_COMMAND)
    if(filterdCommand.length === 0){
        return <box paddingX={1}>
            <text attributes={TextAttributes.DIM}>command not found</text>
        </box>
    }
    return <scrollbox ref={scrollRef} height={visibleHeight}>
      {filterdCommand.map((c,i)=>{
        const isSelect = i === selectedIndex
        return <box
        key={c.value}
           height={1}
           paddingX={1}
           flexDirection="row"
           overflow="hidden"
           backgroundColor={isSelect?"#89B4FA":undefined}
           onMouseDown={()=>onExecute(i)}
           onMouseMove={()=>onSelect(i)}
        >
            <box width={COMMAND_COL_WIDTH} flexShrink={0}>
                <text selectable={false}>/{c.name}</text>
            </box>
              <box flexGrow={1} flexShrink={1} overflow="hidden">
                <text>{c.description}</text>
              </box>
        </box>
      })}
    </scrollbox>
}