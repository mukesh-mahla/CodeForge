import { useNavigate } from "react-router";
import { Header } from "../component/header";
import { useCallback } from "react";
import { Input } from "../component/Input-bar";
import apiClient from "../lib/api-client"


export function Home() {
    const navigate = useNavigate()


    const handleSubmit = useCallback(async (text: string) => {
        const result = await apiClient.session.$post({
            json: {
                title: text.slice(0, 40),
                cwd: process.cwd(),
                initialMessage: {
                    type: "USER",
                    content: text,
                    mode: "BUILD"
                }
            }
        })

        const data = await result.json()
        if (typeof data === "string") {
            throw new Error(data);

        }
        const session = data.session;
        navigate(`sessions/${session.id}`, { state: { text } })
    }, [navigate])

    return (
        <box
            alignItems="center"
            justifyContent="center"
            position="relative"
            width={"100%"}
            height={"100%"}
            flexGrow={1}
            gap={2}
        >
            <Header />
            <box width={"100%"} maxWidth={90} paddingX={2}>
                <Input onSubmit={handleSubmit} />
            </box>

        </box>
    )
}