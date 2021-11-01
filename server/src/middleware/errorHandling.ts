import Koa from "koa";

export default function errorHandling() {
  return async function(ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
      // 正常访问404
      ctx.status = 404;
      ctx.body = "~~ NOT FOUND ~~";
      return;
    } catch (err) {
      // ctx.throw(404)
      if (ctx.status === 404) {
        ctx.status = 404;
        ctx.body = "~~ NOT FOUND ~~";
        return;
      }
      console.log("Error Catcher:", err);
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: "Oh NO! 服务器发生了意料之外的错误！"
      };
    }
  };
}