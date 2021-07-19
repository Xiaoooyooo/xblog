const Router = require("koa-router");

const app = new Router();

app.get("/test", async (ctx, next) => {
  ctx.body = "hello world"
})

module.exports = app;