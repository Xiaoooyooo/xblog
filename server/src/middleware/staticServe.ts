import path from "path";
import fs from "fs";
import mime from "mime";
import { Context, Next } from "koa";
import { WWW } from "../env";

export default function () {
  return async function(ctx: Context, next: Next) {
    const { method, url, res } = ctx;
    try {
      if (method === "GET") {
        if (url === "/") {
          ctx.set("content-type", "text/html");
          console.log("render index.html", path.resolve(WWW, "index.html"));
          ctx.body = fs.readFileSync(path.resolve(WWW, "index.html"));
        } else {
          const stats = fs.statSync(path.resolve(WWW, url));
          if (stats.isFile()) {
            ctx.set("content-type", mime.extension(url) as string);
            fs.createReadStream(path.resolve(WWW, url))
              .pipe(ctx.res);
          }
        }
      } else {
        return next();
      }
    } catch (err) {
      return next();
    }
  };
}