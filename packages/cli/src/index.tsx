import { createCliRenderer } from "@opentui/core";
import { createRoot, } from "@opentui/react";
import { Header } from "./component/header";
import { Input } from "./component/Input-bar";
import { CommandMenu } from "./component/command-menu";

function App() {


  return (
    <box alignItems="center" backgroundColor={	"#1c1b1c"} justifyContent="center" gap={2} width="100%" height="100%">

      <Header />
      <box width={"100%"} maxWidth={80}>
       
        <Input />
      </box>

    </box>
  );
}

const renderer = await createCliRenderer({
  targetFps:60,
  exitOnCtrlC:false
});
createRoot(renderer).render(<App />);
