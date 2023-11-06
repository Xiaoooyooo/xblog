import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

// import "@/assets/styles/reset.css";
import "normalize.css";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/index.css";
import router from "@/routes";
import store from "@/redux";

if (__DEV__) {
  require("@/mock");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
