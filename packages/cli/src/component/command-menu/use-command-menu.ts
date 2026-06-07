import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import {  useMemo, useRef, useState, type RefObject } from "react";
import { FilterCommand } from "./filter-command";
import type { commandType } from "./types";

type useCommandMenuReturnType = {
  showMenu: boolean;
  CommandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (value: string) => void;
  resolveCommand: (index: number) => commandType | undefined;
  setselectedIndex: (index: number) => void;
};

export function useCommandMenu(): useCommandMenuReturnType {
  const [showMenu, setShowMenu] = useState(false);
  const [textValue, setTextvalue] = useState("");
  const [selectedIndex, setselectedIndex] = useState(0);
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);

  const commandQuery =
    showMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

  const filteredCommand = useMemo(
    () => FilterCommand(commandQuery),
    [commandQuery],
  );

  useKeyboard((key) => {
    if(!showMenu) return
    if(key.name === "escape"){
        key.preventDefault()
        setShowMenu(false)
    }
    if (key.name === "up" && showMenu) {
        key.preventDefault()
      setselectedIndex((i:number) => {
       const newIndex = Math.max(i - 1, 0)

       const sb = scrollRef.current
       if(sb && newIndex < sb.scrollTop){
        sb.scrollTo(newIndex)
       }
       return newIndex
    });
      
    }
    if (key.name === "down" && showMenu) {
        key.preventDefault()
        if(filteredCommand.length === 0) return
      setselectedIndex((i:number) =>{

        const newIndex = Math.min(
          i + 1,
          filteredCommand.length - 1
        )

        const sb = scrollRef.current
        if(sb){
            const viewportHeight = sb.viewport.height
            const visibleEnd = sb.scrollTop + viewportHeight-1
            if(newIndex > visibleEnd){
                sb.scrollTo(newIndex - viewportHeight + 1)
            }
        }
        return newIndex
      }
        
      );
    }
  });

  const handleContentChange = (text: string) => {
    setTextvalue(text);
    setselectedIndex(0);

    const scrollBox = scrollRef.current;
    if (scrollBox) {
      scrollBox.scrollTo(0);
    }

    const isCommand = text.startsWith("/") ? text.slice(1) : null;
    if (isCommand !== null && !isCommand.includes(" ")) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };
  const resolveCommand = (index: number): commandType | undefined => {
    const cmd = filteredCommand[index];
    if (cmd) {
      setShowMenu(false);
    }
    return cmd;
  };

  return {
    showMenu,
    CommandQuery: commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setselectedIndex,
  };
}
