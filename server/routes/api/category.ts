import Router from "koa-router";
import { BadRequestError, ForbiddenError, NotFoundError } from "~/errors";
import { AppState, Prisma } from "~/types";
import authentication from "./middlewares/authentication";

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
  let where: Prisma.CategoryWhereInput = { deletedAt: null };
  if (name) {
    where = {
      ...where,
      name: { contains: name },
    };
  }
  const count = await database.category.count({ where });
  const res = await database.category.findMany({
    where,
    select: {
      id: true,
      name: true,
      createdBy: { select: { id: true, username: true } },
      ...(isCountDocuments && {
        _count: {
          select: {
            documents: {
              where: { document: { isDraft: false, deletedAt: null } },
            },
          },
        },
      }),
    },
    // sort is not working as expected
    // orderBy: { ...(isCountDocuments && { documents: { _count: "desc" } }) },
    skip: (page - 1) * size,
    take: size,
  });

  ctx.body = {
    list: res.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d: Record<string, any> = {
        id: item.id,
        name: item.name,
        createdBy: item.createdBy,
      };
      if (isCountDocuments) {
        d.documents = item._count.documents;
      }
      return d;
    }),
    page,
    size,
    total: count,
  };
});

category.get("/detail", authentication({ force: false }), async (ctx) => {
  const { id } = ctx.query;
  if (!id || typeof id !== "string") {
    throw BadRequestError();
  }
  const { database } = ctx.state;
  const category = await database.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      deletedAt: true,
      createdBy: { select: { id: true, username: true, displayName: true } },
    },
  });
  if (!category) {
    throw NotFoundError();
  }
  const { user } = ctx.state;
  if (category.deletedAt !== null && (!user || !user.isAdmin)) {
    throw ForbiddenError();
  }
  ctx.body = {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    createdBy: category.createdBy,
  };
});

category.delete("/delete", authentication({ force: true }), async (ctx) => {
  const { id } = ctx.query;
  if (typeof id !== "string") {
    throw BadRequestError();
  }
  const user = ctx.state.user!;
  const { database } = ctx.state;
  const category = await database.category.findUnique({
    where: { id, deletedAt: null },
    include: { createdBy: true },
  });
  if (!category) {
    throw NotFoundError();
  }
  if (!user.isAdmin && category.createdBy.id !== user.id) {
    throw ForbiddenError();
  }
  await database.category.delete({ where: { id } });
  ctx.body = true;
});

export default category;
