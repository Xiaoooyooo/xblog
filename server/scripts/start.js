/* eslint-disable */
const { spawn } = require("child_process");
const path = require("path");

const sp = spawn("yarn", ["watch:server"], {
  // stdio: "inherit",
  shell: true,
});

sp.on("message", (message) => {
  console.log({ message });
});

sp.on("error", (error) => {
  console.log(error);
});

sp.stdout.on("data", (data) => {
  const log = data.toString("utf8").trim();
  console.log(log);
  if (/Successfully compiled/.test(log)) {
    runServer();
  }
});

/** @type {ReturnType<typeof spawn>} */
let server;
async function runServer() {
  const file = path.resolve(process.cwd(), "build/server/index.js");
  if (server && !server.exitCode) {
    server.kill();
    await new Promise((resolve, reject) => {
      server.on("close", () => {
        resolve();
      });
    });
  }
  server = spawn("node", [file], { stdio: "inherit" });
}
