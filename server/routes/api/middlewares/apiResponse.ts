import { Context, Next } from "koa";
export default function apiResponse() {
  return async function (ctx: Context, next: Next) {
    await next();
    if (ctx.status === 200) {
      ctx.set("content-type", "application/json");
      ctx.body = {
        code: 0,
        message: "OK",
        data: ctx.body,
      };
    }
  };
}
