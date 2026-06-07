import { createCliRenderer } from "@opentui/core";
import { createRoot,  } from "@opentui/react";
import { Header } from "./component/header";

function App() {
  

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box justifyContent="center" alignItems="center" rowGap={1}>
       <Header/>
        <box alignItems="center">
          <textarea 
          placeholder={"what is in your mind today"} backgroundColor={"grey"} width={80} height={4}/>
        </box>
        
      </box>
      
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
