import Router from "koa-router";

import api from "./api";

const router = new Router();

router.get("/", async ctx => {
  ctx.body = "hello world!";
});

router.use(api.routes());

export default router;
