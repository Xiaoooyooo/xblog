import Router from "koa-router";

const blog = new Router({
  prefix: "/blog",
});

blog.get("/list", async (ctx) => {
  const { page = 1, size = 10 } = ctx.query;
  ctx.set("content-type", "application/json");
  ctx.body = {
    list: [],
    page,
    size,
    total: 100,
  };
});

blog.get("/detail", async (ctx, next) => {
  const { title } = ctx.query;
  ctx.set("content-type", "application/json");
  console.log(title);
  if (title === "three") {
    ctx.throw(404, "notfound");
  }
  ctx.body = {
    title,
    text: "",
  };
});

blog.post("/create", async (ctx) => {});

export default blog;
