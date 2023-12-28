import fs, { Stats } from "fs";
import mime from "mime";
import { Context } from "koa";
import { hash } from "./encrypt";

// 1 year
const maxAge = 365 * 24 * 60 * 60;

export default function sendFile(
  ctx: Context,
  stats: fs.Stats,
  filename: string,
) {
  const mimeType = mime.getType(filename);
  const headers: Record<string, string> = mimeType
    ? { "content-type": mimeType }
    : {};
  // use force cache for images
  if (mimeType && mimeType.match(/image\/.+/)) {
    Object.assign(headers, {
      "Cache-control": `max-age=${maxAge}`,
    });
    ctx.set(headers);
  } else {
    const etag = ctx.headers["if-none-match"];
    const _etag = hash(stats.mtime.toISOString());
    Object.assign(headers, {
      etag: _etag,
    });
    ctx.set(headers);
    if (etag === _etag) {
      ctx.status = 304;
      return;
    }
  }
  ctx.body = fs.createReadStream(filename);
}
