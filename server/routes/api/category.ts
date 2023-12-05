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
      ...(isCountDocuments && {
        _count: {
          select: {
            documents: { where: { document: { deletedAt: null } } },
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
      const d: Record<string, any> = { id: item.id, name: item.name };
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

category.get("/documents", async (ctx) => {
  const { id, pageIndex, pageSize } = ctx.query;
  if (
    typeof id !== "string" ||
    typeof pageIndex !== "string" ||
    typeof pageSize !== "string"
  ) {
    throw BadRequestError();
  }
  const { database } = ctx.state;
  const page = parseInt(pageIndex),
    size = parseInt(pageSize);
  const total = await database.document.count({
    where: { categories: { some: { categoryId: id } }, deletedAt: null },
  });
  const documents = await database.document.findMany({
    where: { categories: { some: { categoryId: id } }, deletedAt: null },
    take: size,
    skip: (page - 1) * size,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      content: true,
      title: true,
      isDraft: true,
      user: { select: { id: true, username: true, displayName: true } },
      categories: {
        select: { category: { select: { id: true, name: true } } },
      },
    },
  });
  ctx.body = {
    list: documents.map((document) => ({
      ...document,
      categories: document.categories.map((category) => category.category),
    })),
    page,
    size,
    total,
  };
});

export default category;
