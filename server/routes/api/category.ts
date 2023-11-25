import Router from "koa-router";
import { BadRequestError } from "~/errors";
import { Prisma } from "~/types";

const category = new Router({ prefix: "/category" });

category.get("/list", async (ctx) => {
  // todo: use pagination
  const { name } = ctx.query;
  if (name !== undefined && typeof name !== "string") {
    throw BadRequestError();
  }
  const { database } = ctx.state;
  let where: Prisma.CategoryWhereInput | undefined;
  if (name) {
    where = { name: { contains: name } };
  }
  const res = await database.category.findMany({
    where,
    select: { id: true, name: true },
  });

  ctx.body = { list: res };
});

export default category;
