import { Context } from "koa";
import path from "path";
import fs from "fs";

const indexPath = path.join(__dirname, "../../app/index.html");

export default function renderApp() {
  return function (ctx: Context) {
    console.log("render app");
    ctx.set({
      "content-type": "text/html",
    });
    ctx.body = fs.createReadStream(indexPath);
  };
}
