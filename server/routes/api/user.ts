import Router from "koa-router";
import { BadRequestError, NotFoundError } from "~/errors";
import { normalizeUser, normalizeProfile } from "~/utils/normalize";

import { AppState } from "~/types";

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

export default user;
