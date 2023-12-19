import Router from "koa-router";
import bodyParser from "koa-body";
import auth from "./auth";
import blog from "./blog";
import category from "./category";
import user from "./user";
import upload from "./upload";
import apiResponse from "./middlewares/apiResponse";
import mountState from "./middlewares/mountState";
import { NotFoundError } from "~/errors";

const api = new Router({
  prefix: "/api",
});

api.get("/aa", async (ctx) => {
  ctx.body = "hello world!";
});

api.use(
  bodyParser({
    // the formidable packaged in koa-body is not used because its version is too low.
    // multipart: true,
  }),
);
api.use(mountState());
api.use(apiResponse());
api.use(auth.routes());
api.use(blog.routes());
api.use(category.routes());
api.use(user.routes());
api.use(upload.routes());
api.all("(.*)", async () => {
  throw NotFoundError("endpoint not found");
});

export default api;
