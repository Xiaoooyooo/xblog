import http from "http";
import https from "https";
import { execSync } from "child_process";
import env from "./env";
import { tryToReadFile } from "./utils/fs";

import app from "./app";

function prismaMigration() {
  const output = execSync("yarn migrate");
  console.log(output.toString("utf8"));
}

async function main() {
  if (env.sslCertificatePath && env.sslCertificateKeyPath) {
    const cert = await tryToReadFile(env.sslCertificatePath);
    const key = await tryToReadFile(env.sslCertificateKeyPath);
    if (!cert || !key) {
      throw new Error("ssl certificates error");
    }
    const httpsServer = https.createServer({ cert, key }, app.callback());
    httpsServer.listen(443, () => {
      console.log("server is running");
    });

    // redirect http request to https
    http
      .createServer((req, res) => {
        res.statusCode = 301;
        res.setHeader("location", `https://${env.hostname}${req.url}`);
        res.end();
      })
      .listen(80);
  } else {
    const server = http.createServer(app.callback());
    server.listen(env.port, () => {
      console.log("server is running");
    });
  }
}

if (env.isProduction) {
  prismaMigration();
}
main();
