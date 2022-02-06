import Router from "koa-router";

import blog from "./blog";

const api = new Router({
  prefix: "/api"
});

api.get("/aa", async ctx => {
  ctx.body = "hello world!";
});

api.use("/", blog.routes());

export default api;
