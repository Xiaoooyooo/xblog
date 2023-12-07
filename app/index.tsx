import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/assets/styles/variables.css";
import "normalize.css";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/index.css";

import App from "./App";

if (__DEV__) {
  require("@/mock");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
