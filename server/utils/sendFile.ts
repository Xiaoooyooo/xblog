import fs, { Stats } from "fs";
import zlib from "zlib";
import mime from "mime";
import { Context } from "koa";
import { hash } from "./encrypt";

// 1 year
const maxAge = 365 * 24 * 60 * 60;

type SendFileOptions = {
  context: Context;
  filename: string;
  stats: Stats;
};

export default function sendFile(options: SendFileOptions) {
  const { context: ctx, filename, stats } = options;
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
  const gzip = zlib.createGzip();
  ctx.set("Content-Encoding", "gzip");
  ctx.body = fs.createReadStream(filename).pipe(gzip);
}
