
export type contextType = {
    exit:()=>void
}


export type commandType = {
    name:string,
    description:string,
    value:string,
    action?:(ctx:contextType)=>void | Promise<void>
}