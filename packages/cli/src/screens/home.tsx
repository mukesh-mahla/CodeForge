import { useNavigate } from "react-router";
import { Header } from "../component/header";
import { useCallback } from "react";
import { Input } from "../component/Input-bar";


export function Home(){
    const navigate = useNavigate()

    const handleSubmit = useCallback((text:string)=>{
        navigate("/sessions/new",{state:{message:text}})
    },[navigate])

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
<Header/>
<box width={"100%"} maxWidth={90} paddingX={2}>
<Input onSubmit={handleSubmit} />
</box>
        </box>
    )
}