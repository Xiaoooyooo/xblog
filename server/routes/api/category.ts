import Router from "koa-router";
import { BadRequestError } from "~/errors";
import { AppState, Prisma } from "~/types";

const category = new Router<AppState>({ prefix: "/category" });

category.get("/list", async (ctx) => {
  // todo: use pagination
  const { name, pageIndex, pageSize } = ctx.query;
  if (name !== undefined && typeof name !== "string") {
    throw BadRequestError();
  }
  if (typeof pageIndex !== "string" || typeof pageSize !== "string") {
    throw BadRequestError();
  }
  const page = Number(pageIndex),
    size = Number(pageSize);
  const { database } = ctx.state;
  let where: Prisma.CategoryWhereInput | undefined;
  if (name) {
    where = { name: { contains: name } };
  }
  const count = await database.category.count({ where });
  const res = await database.category.findMany({
    where,
    select: { id: true, name: true },
    skip: (page - 1) * size,
    take: size,
  });

  ctx.body = { list: res, page, size, total: count };
});

export default category;
