import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// No GitHub Pages de projeto o site fica em /<repo>/; o workflow passa esse caminho em BASE_PATH.
export default defineConfig({
  base: Deno.env.get("BASE_PATH") ?? "/",
  plugins: [react(), tailwindcss()],
});
