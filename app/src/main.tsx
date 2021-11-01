import React from "react";
import ReactDom from "react-dom";

import "reset-css";
import "assets/styles/common.scss";
import App from "routes";

ReactDom.render(<App />, document.getElementById("root"), () => {
  console.log("APP Mounted!");
});