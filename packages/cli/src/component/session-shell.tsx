

import type { ReactNode } from "react"
import { Input } from "./Input-bar"
import { TextAttributes } from "@opentui/core"
import { Spinner } from "./spinner"


type Prop = {
    children?: ReactNode
    loading?: boolean
    inputDisable?: boolean
    onSubmit: (text: string) => void
}

export function SessionShell({ children, loading = false, inputDisable = false, onSubmit }: Prop) {


    return (
        <box
            flexDirection="column"
            flexGrow={1}
            width={"100%"}
            height={"100%"}
            paddingX={2}
            paddingY={1}
            gap={2}
        >

            <scrollbox flexGrow={1} width={"100%"} stickyStart="bottom" stickyScroll>
                <box gap={1}>{children}</box>
            </scrollbox>
            <box flexShrink={0}>
                <Input onSubmit={onSubmit} disabled={inputDisable} />
            </box>
            <box
                flexShrink={0}
                flexDirection="row"
                justifyContent="space-between"
                width={"100%"}
                height={1}
                gap={2}
                paddingLeft={1}
            >
                <box flexDirection="row" alignItems="center" gap={2}>
                    {loading ? <Spinner /> : null}
                </box>


                <box flexDirection="row" gap={1} flexShrink={0} marginLeft={"auto"}>
                    <text>Tab</text>
                    <text attributes={TextAttributes.DIM}>agents</text>
                </box>
            </box>
        </box>
    )
}
