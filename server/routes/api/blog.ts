import Router from "koa-router";
import authentication from "./middlewares/authentication";
import { BadRequestError, ForbiddenError, NotFoundError } from "~/errors";
import { AppState, Prisma } from "~/types";
import {
  normalizeBlog,
  normalizeCategory,
  normalizeUser,
  normalizeProfile,
} from "~/utils/normalize";

const blog = new Router<AppState>({
  prefix: "/blog",
});

blog.get("/list", async (ctx) => {
  const {
    pageIndex = "1",
    pageSize = "10",
    categoryId,
    draft = "false",
    deleted = "false",
    orderBy = "updatedAt",
    order = "desc",
  } = ctx.query;
  const { database } = ctx.state;
  if (typeof orderBy !== "string" || typeof order !== "string") {
    throw BadRequestError();
  }
  if (categoryId && typeof categoryId !== "string") {
    throw BadRequestError();
  }
  const _page = Number(pageIndex),
    _size = Number(pageSize),
    isDraft = draft === "true",
    isDeleted = deleted === "true";

  let where: Prisma.DocumentWhereInput = {};
  if (categoryId) {
    where = { ...where, categories: { some: { categoryId } } };
  }
  if (isDeleted) {
    where = { ...where, deletedAt: { not: null } };
  } else {
    where = { ...where, deletedAt: null };
  }
  if (isDraft) {
    where = { ...where, isDraft: true };
  } else {
    where = { ...where, isDraft: false };
  }
  const total = await database.document.count({
    where,
  });
  const data = await database.document.findMany({
    skip: (_page - 1) * _size,
    take: _size,
    orderBy: { [orderBy]: order },
    where,
    include: {
      categories: {
        include: { category: true },
        where: { category: { is: { deletedAt: null } } },
      },
      user: { include: { profile: { select: { avatar: true } } } },
    },
  });
  ctx.body = {
    list: data.map((item) => ({
      ...normalizeBlog(item),
      user: {
        ...normalizeUser(item.user),
        avatar: item.user.profile?.avatar,
      },
      categories: item.categories.map((catagory) =>
        normalizeCategory(catagory.category),
      ),
    })),
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
  const blog = await database.document.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
        where: { category: { is: { deletedAt: null } } },
      },
      user: true,
    },
  });
  if (!blog) {
    throw NotFoundError();
  }
  ctx.body = {
    ...normalizeBlog(blog),
    user: normalizeUser(blog.user),
    categories: blog.categories
      .map((item) => item.category)
      .map(normalizeCategory),
  };
});

blog.post("/create", authentication({ force: true }), async (ctx) => {
  const database = ctx.state.database;
  const user = ctx.state.user!;
  const { title, content, isDraft, categoriesId, createdCategories } =
    ctx.state.body;
  if (!title) {
    throw BadRequestError("Blog title is required!");
  }
  if (!Array.isArray(categoriesId) || !Array.isArray(createdCategories)) {
    throw BadRequestError("Wrong category type!");
  }
  const blog = await database.document.create({
    data: {
      title,
      content,
      userId: user.id,
      isDraft,
      categories: {
        create: [
          ...createdCategories.map((item: string) => ({
            category: {
              create: { name: item, createdBy: { connect: { id: user.id } } },
            },
          })),
          ...categoriesId.map((item: string) => ({
            category: {
              connect: { id: item },
            },
          })),
        ],
      },
    },
  });
  ctx.body = { id: blog.id };
});

blog.post("/update", authentication({ force: true }), async (ctx) => {
  const { body, database } = ctx.state;
  const user = ctx.state.user!;
  const { id, title, content, isDraft, categoriesId, createdCategories } = body;
  if (
    !id ||
    !title ||
    !content ||
    !Array.isArray(categoriesId) ||
    !Array.isArray(createdCategories)
  ) {
    throw BadRequestError();
  }
  const blog = await database.document.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });
  if (!blog) {
    throw NotFoundError("The blog you are trying to update does not exist");
  }
  if (blog.userId !== user.id && !user.isAdmin) {
    throw ForbiddenError();
  }
  if (!blog.isDraft && isDraft) {
    throw ForbiddenError("Cannot unpublish a published blog");
  }

  const prevCategories = blog.categories.map((item) => item.category.id);
  const prevCategoriesSet = new Set(prevCategories);
  const newUsedCategories: string[] = [];
  categoriesId.forEach((id) => {
    if (!prevCategoriesSet.has(id)) {
      newUsedCategories.push(id);
    } else {
      prevCategoriesSet.delete(id);
    }
  });
  const deletedCategories = Array.from(prevCategoriesSet.values());

  await database.document.update({
    where: { id },
    data: {
      title,
      content,
      isDraft,
      categories: {
        create: [
          ...createdCategories.map((item: string) => ({
            category: {
              create: { name: item, createdBy: { connect: { id: user.id } } },
            },
          })),
          ...newUsedCategories.map((item: string) => ({
            category: {
              connect: { id: item },
            },
          })),
        ],
        deleteMany: deletedCategories.map((item) => ({ categoryId: item })),
      },
    },
  });
  ctx.body = { id };
});

blog.delete("/delete", authentication({ force: true }), async (ctx) => {
  const { id } = ctx.query;
  if (typeof id !== "string") {
    throw BadRequestError();
  }
  const user = ctx.state.user!;
  const { database } = ctx.state;
  const blog = await database.document.findUnique({ where: { id } });
  if (!blog) {
    throw NotFoundError();
  }
  if (blog.userId !== user.id && !user.isAdmin) {
    throw ForbiddenError();
  }
  await database.document.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  ctx.body = true;
});

export default blog;
