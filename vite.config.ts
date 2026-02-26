import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  // En local : base: "/"  →  http://localhost:5173/
  // Pour GitHub Pages : base: "/starknet-games-hub/"
  base: "/",
});
