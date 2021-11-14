import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import "assets/styles/reset.css";
import "assets/styles/common.scss";
import App from "routes";
import store from "./store";
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
  () => {
    console.log("APP Mounted!");
  }
);