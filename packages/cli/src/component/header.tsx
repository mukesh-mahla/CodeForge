import { useTheme } from "./provider/theme"


export function Header() {
const {colors} = useTheme()

    return <box
        alignItems="center" justifyContent="center"
    >
        <box flexDirection="row" justifyContent="center" alignItems="center" gap={0.5}>
            <ascii-font text="night" color={colors.primary} />
            <ascii-font text="code" color={colors.dimSeparator} />
        </box>


    </box>
}