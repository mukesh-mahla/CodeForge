import { useLocation, useNavigate } from "react-router";

import { useEffect } from "react";
import { ErrorMessage,UserMessage,BotMessage } from "../component/messages";
import { SessionShell } from "../component/session-shell";

export function NewSession(){
    const navigate = useNavigate()
    const location = useLocation()
    
    const state = location.state as {message?:string} | null
     
    useEffect(()=>{
           if(!state?.message){
            navigate("/",{replace:true})
           }
    },[state,navigate])
    if(!state?.message) return null

    return (
      <SessionShell onSubmit={()=>{}} inputDisable loading>
         <UserMessage message={state.message}/>
        <BotMessage content="hello from bot" model="opus"/>
        <ErrorMessage message="oops"/>
      </SessionShell>
           
    )
}