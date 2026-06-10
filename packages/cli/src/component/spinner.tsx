import "opentui-spinner/react"
import { useTheme } from "./provider/theme"


export function Spinner(){
const {colors} = useTheme()
    return <spinner name="aesthetic" color={colors.primary}></spinner>
}