import Router from "koa-router";
import { BadRequestError } from "~/errors";
import { AppState, Prisma } from "~/types";

const category = new Router<AppState>({ prefix: "/category" });

category.get("/list", async (ctx) => {
  const { name, pageIndex, pageSize, documents } = ctx.query;
  if (name !== undefined && typeof name !== "string") {
    throw BadRequestError();
  }
  if (documents !== undefined && typeof documents !== "string") {
    throw BadRequestError();
  }
  if (typeof pageIndex !== "string" || typeof pageSize !== "string") {
    throw BadRequestError();
  }

  const page = Number(pageIndex),
    size = Number(pageSize),
    isCountDocuments = documents === "true";
  const { database } = ctx.state;
  let where: Prisma.CategoryWhereInput | undefined;
  if (name) {
    where = { name: { contains: name } };
  }
  const count = await database.category.count({ where });
  const res = await database.category.findMany({
    where,
    select: {
      id: true,
      name: true,
      ...(isCountDocuments && { _count: { select: { documents: true } } }),
    },
    orderBy: { documents: { _count: "desc" } },
    skip: (page - 1) * size,
    take: size,
  });

  ctx.body = {
    list: isCountDocuments
      ? res.map((item) => ({
          id: item.id,
          name: item.name,
          documents: item._count.documents,
        }))
      : res,
    page,
    size,
    total: count,
  };
});

export default category;
