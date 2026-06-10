import { Outlet } from "react-router";
import { ToastProvider } from "../component/provider/toast";
import { DialogProvider } from "../component/provider/dialog";
import { KeyboardProvider } from "../component/provider/keyboard"
import { ThemeProvider } from "../component/provider/theme";
import { ThemeRoot } from "./themed-root";


export function RootLayout() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <KeyboardProvider>
                    <DialogProvider>
                        <ThemeRoot>
                            <Outlet />
                        </ThemeRoot>
                    </DialogProvider>
                </KeyboardProvider>
            </ToastProvider>

        </ThemeProvider>
    )
}