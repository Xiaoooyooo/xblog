import Koa from "koa";
import { InternalServerError } from "~/errors";

export default function errorHandler() {
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log("catch err:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let _error: any;
      if (typeof err.status !== "number") {
        _error = InternalServerError(err.message);
      } else if (err instanceof Error) {
        _error = err;
      } else {
        _error = InternalServerError(
          typeof err === "string" ? err : JSON.stringify(err),
        );
      }
      ctx.status = _error.status;
      const accept = ctx.accepts("json", "html");
      if (accept === "json") {
        ctx.set("content-type", "application/json;charset=utf8");
        ctx.body = JSON.stringify({
          code: -1,
          status: _error.status,
          message: _error.message,
        });
      } else {
        ctx.set("content-type", "text/html;charset=utf8");
        // todo render error page
        ctx.body = "<h1>Error</h1>";
      }
    }
  };
}
