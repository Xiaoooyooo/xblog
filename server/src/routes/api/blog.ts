import * as fs from "fs";
import * as path from "path";
import Router from "koa-router";

const blog = new Router();

blog.post("blog.list", async (ctx) => {
  console.log(ctx.request.body);
  const { page, size } = ctx.request.body;
  ctx.set("content-type", "application/json");
  ctx.body = {
    list: [],
    page,
    size,
    total: 100,
  };
});

blog.get("blog.info", async (ctx, next) => {
  const { blogId } = ctx.query;
  ctx.set("content-type", "application/json");
  console.log(blogId);
  if (blogId === "three") {
    ctx.throw(404, "notfound", { a: "aa", b: "bb" }, { c: "cc" });
  }
  ctx.body = {
    id: ctx.query.blogId,
    text: fs.readFileSync(path.resolve(__dirname, "blog.data.md"), "utf-8"),
  };
});

export default blog;
