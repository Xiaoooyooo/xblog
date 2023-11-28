/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");

function execAsync(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function build() {
  await Promise.all([
    execAsync("yarn build:app"),
    execAsync("yarn build:server"),
    execAsync("cp -r ./server/prisma ./build/server/"),
    execAsync("cp package.json ./build/"),
    execAsync("cp .env.sample ./build/"),
  ]);

  console.log("done");
}

build();
