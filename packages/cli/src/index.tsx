import { createCliRenderer } from "@opentui/core";
import { createRoot, } from "@opentui/react";
import { Header } from "./component/header";
import { Input } from "./component/Input-bar";
import { CommandMenu } from "./component/command-menu";
import { ToastProvider } from "./component/provider/toast";
import { KeyboardProvider } from "./component/provider/keyboard";
import { DialogProvider } from "./component/provider/dialog";
import { ThemeProvider, useTheme } from "./component/provider/theme";

function ThemeRoot(){
  const {colors} = useTheme()
return ( <box alignItems="center" backgroundColor={colors.background} justifyContent="center" gap={2} width="100%" height="100%">

            <Header />
            <box width={"100%"} maxWidth={80}>

              <Input onSubmit={() => { }} />
            </box>

          </box>)
}

function App() {


  return (
    <KeyboardProvider>
      <ThemeProvider>
      <DialogProvider>
        <ToastProvider>
         <ThemeRoot/>
        </ToastProvider>
      </DialogProvider>
</ThemeProvider>
    </KeyboardProvider>


  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false
});
createRoot(renderer).render(<App />);
