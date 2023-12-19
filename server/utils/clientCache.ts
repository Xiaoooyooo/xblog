import { Context } from "koa";
import { Stats } from "fs";
import mime from "mime";
import { hash } from "./encrypt";

/**
 * 协商缓存
 */
export function validationCache<T extends Context>(
  ctx: T,
  stat: Stats,
  filename: string,
) {
  const etag = ctx.headers["if-none-match"];
  const { mtime } = stat;
  const _etag = hash(mtime.toISOString());
  if (etag === _etag) {
    ctx.status = 304;
    return;
  }
  const headers = appendMimeType(
    {
      etag: _etag,
    },
    filename,
  );
  ctx.set(headers);
}

/**
 * 强缓存
 */
export function forceCache<T extends Context>(
  ctx: T,
  stat: Stats,
  filename: string,
) {
  const maxAge = 365 * 24 * 60 * 60;
  const headers = appendMimeType(
    {
      "Cache-control": `max-age=${maxAge}`,
    },
    filename,
  );
  ctx.set(headers);
}

function appendMimeType(headers: Record<string, string>, filename: string) {
  const mimeType = mime.getType(filename);
  if (!mimeType) {
    return headers;
  }
  return { ...headers, "content-type": mimeType };
}
