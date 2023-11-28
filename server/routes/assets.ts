import Router from "koa-router";
import fs from "fs";
import path from "path";
import mime from "mime";
import { hash } from "~/utils/encrypt";

const assets = new Router({ prefix: "/assets" });

const appPath = "../../app/assets";

assets.get("(.*)", async (ctx, next) => {
  try {
    const filename = ctx.path.replace(/^\/assets/, "");
    const filepath = path.join(__dirname, appPath, filename);
    const isExists = fs.existsSync(filepath);
    if (!isExists) {
      return next();
    }
    const filestats = fs.statSync(filepath);
    if (!filestats.isFile()) {
      return next();
    }
    const etag = ctx.headers["if-none-match"];
    const { mtime } = filestats;
    const _etag = hash(mtime.toISOString());
    if (etag === _etag) {
      ctx.status = 304;
      return;
    }
    const mimeType = mime.getType(filepath);
    let headers: Record<string, string> = {
      etag: _etag,
    };
    if (mimeType) {
      headers = {
        ...headers,
        "content-type": mimeType,
      };
    }
    ctx.set(headers);
    ctx.body = fs.createReadStream(filepath);
  } catch (err) {
    console.log(err);
    return next();
  }
});

export default assets;
