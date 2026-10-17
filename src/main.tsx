import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Só mostra a página quando a fonte estiver pronta, pra não piscar com a fonte errada.
// Se demorar demais, mostra assim mesmo.
const family = '"JetBrainsMono Nerd Font"';
const fontsReady = Promise.all([
  document.fonts.load(`400 1em ${family}`),
  document.fonts.load(`700 1em ${family}`),
]);
const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
Promise.race([fontsReady, timeout]).finally(() => root.classList.add("ready"));
