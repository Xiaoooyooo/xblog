import Koa from "koa";
import Router from "koa-router";

const account = new Router();

account.get("/", async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = "this is a test.";
})

// account.post("/login", async (ctx, next) => {});

export default account;