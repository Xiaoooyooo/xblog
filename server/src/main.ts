import * as http from "http";
import fs from "fs";

import { ROOT, WWW, BLOGS_DIR, ABOUT_ME, BLOGS_INFO, PORT } from "./env";

// 检查所需文件夹状态
new Promise<void>((resolve, reject) => {
  if (!fs.existsSync(ROOT)) {
    throw new Error(`${ROOT} is it exists.`);
  }
  if (!fs.existsSync(WWW)) {
    throw new Error(`WWW: ${WWW} is not exsist.`);
  }
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }
  if (!fs.existsSync(ABOUT_ME)) {
    fs.mkdirSync(ABOUT_ME, { recursive: true });
  }
  if (!fs.existsSync(BLOGS_INFO)) {
    fs.writeFileSync(
      BLOGS_INFO,
      JSON.stringify({ blogs: [], about: {} }, null, 2),
      "utf-8"
    );
  }
  resolve();
})
  .then(() => {
    start();
  })
  .catch(err => {
    console.log(err);
  });

function start() {
  import("./app").then(({ default: app }) => {
    http.createServer(app.callback()).listen(PORT, () => {
      console.log(`\n\tapp is runing at http://127.0.0.1:${PORT}\n`);
    });
  });
}
