import env from "./env";
import * as http from "http";
import { execSync } from "child_process";

import app from "./app";

function prismaMigration() {
  const output = execSync("yarn migrate");
  console.log(output.toString("utf8"));
}

function main() {
  const server = http.createServer(app.callback());

  server.listen(env.port, () => {
    console.log("server is running");
  });
}

prismaMigration();
main();
