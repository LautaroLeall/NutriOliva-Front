import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import { initPwaInstallCapture } from "@/hooks/usePwaInstall";
import App from "./App.jsx";

initPwaInstallCapture();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
