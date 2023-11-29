/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(stdout ? stdout : stderr);
      }
    });
  });
}

async function build() {
  await Promise.all([
    execAsync("yarn build:app"),
    execAsync("yarn build:server"),
  ]);
  await execAsync("cp -r ./server/prisma ./build/server/");
  await execAsync("cp package.json ./build/");
  await execAsync("cp .env.sample ./build/");
  console.log("done");
}

build();
