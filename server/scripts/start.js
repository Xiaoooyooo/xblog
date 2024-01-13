/* eslint-disable */
const { spawn } = require("child_process");
const path = require("path");

function run(option) {
  const { command, args, options = { shell: true }, onData, onError } = option;
  const sp = spawn(command, args, options);
  sp.on("message", (message) => {
    console.log({ message });
  });

  sp.on("error", (error) => {
    console.log(error);
    onError?.(error);
  });

  sp.stdout.on("data", (data) => {
    const log = data.toString("utf8").trim();
    console.log(log);
    onData(log);
  });
}

let serverCompiled = false,
  sharedCompiled = false;

run({
  command: "yarn",
  args: ["watch:server"],
  onData: function (data) {
    if (/Successfully compiled/.test(data)) {
      serverCompiled = true;
      runServer();
    }
  },
});

run({
  command: "yarn",
  args: ["watch:shared"],
  onData: function (data) {
    if (/Successfully compiled/.test(data)) {
      sharedCompiled = true;
      runServer();
    }
  },
});

/** @type {ReturnType<typeof spawn>} */
let server;
async function runServer() {
  if (!serverCompiled || !sharedCompiled) {
    return;
  }
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
