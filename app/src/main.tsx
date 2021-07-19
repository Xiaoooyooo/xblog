import React from "react";
import ReactDom from "react-dom";

import "reset-css";
import App from "routes/router";

ReactDom.render(<App />, document.getElementById("root"), () => {
	console.log("APP Mounted!")
})