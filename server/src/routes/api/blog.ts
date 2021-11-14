import * as fs from "fs";
import * as path from "path";
import Router from "koa-router";

const blog = new Router();

blog.get("blog.info", async (ctx, next) => {
  ctx.set("content-type", "application/json");
  ctx.body = {
    id: ctx.query.blogId,
    text: fs.readFileSync(path.resolve(__dirname, "blog.data.md"), "utf-8"),
  };
});

export default blog;
