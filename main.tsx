import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StarknetProvider } from "./cartridge";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetProvider>
      <App />
    </StarknetProvider>
  </StrictMode>
);
