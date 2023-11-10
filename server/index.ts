import * as http from "http";
import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const server = http.createServer(app.callback());

server.listen(9999, () => {
  console.log("server is running");
});
