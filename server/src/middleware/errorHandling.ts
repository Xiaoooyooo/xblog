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
      }
      console.log("<===<", ctx.status);
      console.log("\n");
    } catch (err) {
      console.log("catch err:", err);
    }
  };
}