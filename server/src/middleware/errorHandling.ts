import Koa from "koa";

export default function errorHandling() {
  return async function(ctx: Koa.Context, next: Koa.Next) {
    try {
      console.log(">===>", ctx.status);
      console.log(ctx.method, ctx.path);
      await next();
      // 正常访问404
      if (ctx.status === 404) {
        console.log("TODO: render 404 page");
        ctx.status = 404;
        ctx.body = "~~ NOT FOUND ~~";
      } else {
        ctx.body = {
          status: ctx.status,
          data: ctx.body,
        };
      }
      console.log("<===<", ctx.status);
    } catch (err) {
      ctx.set("content-type", "application/json");
      if (ctx.status === 404) {
        ctx.status = 404;
        ctx.body = {
          status: 404,
          message: "Not Found"
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          status: 500,
          message: "Oh NO! 服务器发生了意料之外的错误！"
        };
      }
      console.log("<===<", ctx.status);
    }
  };
}