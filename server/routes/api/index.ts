import Router from "koa-router";
import bodyParser from "koa-body";
import { prisma } from "~/database";
import { AppState } from "~/types";
import auth from "./authentication";
import apiResponse from "./middlewares/apiResponse";

const api = new Router<AppState>({
  prefix: "/api",
});

api.get("/aa", async (ctx) => {
  ctx.body = "hello world!";
});
api.use(bodyParser());
api.use((ctx, next) => {
  if (ctx.request.body) {
    ctx.state.body = ctx.request.body;
  }
  ctx.state.database = prisma;
  return next();
});
api.use(apiResponse());

api.use(auth.routes());

export default api;
