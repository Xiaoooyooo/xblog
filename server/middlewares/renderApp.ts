import { Context, Next } from "koa";
import path from "path";
import zlib from "zlib";
import { isFileExists, readFile } from "~/utils/fs";
import { hash } from "~/utils/encrypt";
import getClientEnv from "~/utils/getClientEnv";

const indexPath = path.join(__dirname, "../../app/index.html");

export default function renderApp() {
  return async function (ctx: Context, next: Next) {
    const stats = await isFileExists(indexPath);
    if (!stats) {
      return next();
    }
    const etag = ctx.headers["if-none-match"];
    const _etag = hash(stats.mtime.toISOString());
    ctx.set("etag", _etag);
    if (etag === _etag) {
      ctx.status = 304;
      return;
    }
    let content = await readFile(indexPath);
    content = content.replace(
      /\{\{env}\}/,
      `<script>window.ENV=${JSON.stringify(getClientEnv())}</script>`,
    );
    ctx.set({
      "content-type": "text/html",
      "content-encoding": "gzip",
    });
    ctx.body = zlib.createGzip().end(content);
  };
}
