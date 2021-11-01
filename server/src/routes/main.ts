import Koa from "koa";
import Router from "koa-router";

const main = new Router;

main.get("/", async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = "hello World";
});

export default main;
