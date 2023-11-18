import Router from "koa-router";
import authentication from "./middlewares/authentication";
import { BadRequestError, ForbiddenError, NotFoundError } from "~/errors";
import { AppState } from "~/types";

const blog = new Router<AppState>({
  prefix: "/blog",
});

blog.get("/list", async (ctx) => {
  const {
    page = "1",
    size = "10",
    orderBy = "updatedAt",
    order = "desc",
  } = ctx.query;
  const { database } = ctx.state;
  if (typeof orderBy !== "string" || typeof order !== "string") {
    throw BadRequestError();
  }
  const _page = Number(page),
    _size = Number(size);
  const total = await database.document.count();
  const data = await database.document.findMany({
    skip: (_page - 1) * _size,
    take: _size,
    orderBy: {
      [orderBy]: order,
    },
  });
  ctx.body = {
    list: data,
    page: _page,
    size: _size,
    total,
  };
});

blog.get("/detail", async (ctx) => {
  const { id } = ctx.query;
  if (!id || typeof id !== "string") {
    throw BadRequestError("bad blog id parameter");
  }
  const database = ctx.state.database;
  const blog = await database.document.findUnique({ where: { id } });
  if (!blog) {
    throw NotFoundError();
  }
  ctx.body = blog;
});

blog.post("/create", authentication({ force: true }), async (ctx) => {
  const database = ctx.state.database;
  const user = ctx.state.user!;
  const { title, content } = ctx.state.body;
  if (!title) {
    throw BadRequestError("Blog title is required!");
  }
  const blog = await database.document.create({
    data: { title, content, userId: user.id },
  });
  ctx.body = { blog };
});

blog.patch("/update", authentication({ force: true }), async (ctx) => {
  const { body, database } = ctx.state;
  const user = ctx.state.user!;
  const { id, title, content } = body;
  const blog = await database.document.findUnique({ where: { id } });
  if (!blog) {
    throw NotFoundError("The blog you are trying to update does not exist");
  }
  if (!user.isAdmin && blog.userId !== user.id) {
    throw ForbiddenError();
  }
  await database.document.update({
    where: { id },
    data: { title, content, updatedAt: new Date() },
  });
  ctx.body = {
    data: "OK",
  };
});

export default blog;
