import type { ReactNode } from "react"
import { useTheme } from "../component/provider/theme"

type props = {
    children:ReactNode
}

export function ThemeRoot({children}:props){
  const {colors} = useTheme()
return (
    <box
    backgroundColor={colors.background}
    width={"100%"}
    height={"100%"}
    flexGrow={1}
    >
{children}
    </box>
)
}
