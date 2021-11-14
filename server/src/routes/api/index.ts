import Router from "koa-router";

import blog from "./blog";

const api = new Router({
  prefix: "/api"
});

api.use("/", blog.routes());

api.get("(.*)", async ctx => {
  ctx.body = {
    message: "invalid api"
  };
});

export default api;