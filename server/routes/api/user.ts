import Router from "koa-router";
import { BadRequestError, NotFoundError } from "~/errors";
import { normalizeUser, normalizeProfile } from "~/utils/normalize";

import { AppState } from "~/types";
import authentication from "./middlewares/authentication";

const user = new Router<AppState>({
  prefix: "/user",
});

user.get("/profile", async (ctx) => {
  const { id } = ctx.query;
  if (typeof id !== "string") {
    throw BadRequestError();
  }
  const { database } = ctx.state;
  const userWithProfile = await database.userProfile.findUnique({
    where: { userId: id },
    include: { user: true },
  });
  if (!userWithProfile) {
    throw NotFoundError();
  }
  ctx.body = {
    ...normalizeUser(userWithProfile.user),
    ...normalizeProfile(userWithProfile),
  };
});

user.post("/profile/update", authentication({ force: true }), async (ctx) => {
  const { introduction, resume } = ctx.state.body;
  const isUpdateIntroduction = typeof introduction === "string";
  const isUpdateResume = typeof resume === "string";
  if (!isUpdateIntroduction && !isUpdateResume) {
    throw BadRequestError();
  }
  const data =
    isUpdateIntroduction && isUpdateResume
      ? { introduction, resume }
      : isUpdateIntroduction
        ? { introduction }
        : isUpdateResume
          ? { resume }
          : {};
  const database = ctx.state.database;
  const user = ctx.state.user!;
  await database.userProfile.update({ where: { userId: user.id }, data });
  ctx.body = true;
});

export default user;
