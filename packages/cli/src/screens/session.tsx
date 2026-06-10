import { useParams } from "react-router";

export function Session() {
    const { id } = useParams()


    return (
        <box flexGrow={1} padding={2}>
            <text>{id}</text>
        </box>
    )
}