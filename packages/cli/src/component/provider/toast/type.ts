export type ToastVarient = "success" | "error" | "info" 

export type ToastOptions = {
    message:string,
    varient?:ToastVarient,
    duration?:number
}

export const DEFAULT_TOAST_DURATION = 3000