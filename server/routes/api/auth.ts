import Router from "koa-router";
import { AppState } from "~/types";
import { hash } from "~/utils/encrypt";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "~/errors";
import {
  signRefreshToken,
  signAccessToken,
  verifyRefreshToken,
} from "~/utils/jwt";
import { normalizeUser } from "~/utils/normalize";
import env from "~/env";

const auth = new Router<AppState>({
  prefix: "/auth",
});

auth.get("/", async (ctx) => {
  const refreshToken = ctx.cookies.get("refreshToken");
  if (!refreshToken) {
    ctx.body = { isLogin: false };
    return;
  }
  const { database } = ctx.state;
  const token = await database.userToken.findFirst({
    where: { refreshToken },
    include: { user: { include: { profile: true } } },
  });
  if (!token) {
    ctx.cookies.set("refreshToken", "", { expires: new Date(0) });
    ctx.body = { isLogin: false };
    return;
  }
  const { isError } = await verifyRefreshToken(refreshToken);
  if (isError) {
    await database.userToken.delete({ where: { id: token.id } });
    ctx.cookies.set("refreshToken", "", { expires: new Date(0) });
    ctx.body = { isLogin: false };
    return;
  }
  const accessToken = signAccessToken(token.user);
  ctx.body = {
    ...normalizeUser(token.user),
    avatar: token.user.profile?.avatar,
    token: accessToken,
    isLogin: true,
  };
});

auth.post("/register", async (ctx) => {
  if (!env.allowNewUerRegister) throw ForbiddenError();
  const { database, body } = ctx.state;
  if (!body) throw BadRequestError();
  const { username, password, displayName } = body;
  if (!username) throw BadRequestError("username is needed");
  if (!password) throw BadRequestError("password is needed");

  const user = await database.user.findUnique({ where: { username } });
  if (user) {
    throw ForbiddenError("The username is already exists");
  }

  const admin = await database.user.findFirst({ where: { isAdmin: true } });
  const newUser = await database.user.create({
    data: {
      username,
      password: hash(password),
      displayName,
      // create a empty profile
      profile: { create: {} },
      // set the first registered user to administrator by default
      ...(admin ? {} : { isAdmin: true }),
    },
  });

  ctx.body = normalizeUser(newUser);
});

auth.post("/login", async (ctx) => {
  const { database, body } = ctx.state;
  if (!body) throw BadRequestError();
  const { username, password } = body;
  if (!username) throw BadRequestError("username is needed");
  if (!password) throw BadRequestError("password is needed");
  const user = await database.user.findUnique({
    where: { username },
    include: { profile: true },
  });
  if (!user) throw UnauthorizedError("Wrong username or password");
  const _password = hash(password);
  if (_password !== user.password) {
    throw UnauthorizedError("Wrong username or password");
  }
  const refreshToken = signRefreshToken({
    username: user.username,
    id: user.id,
  });
  const accessToken = signAccessToken({ username: user.username, id: user.id });
  await database.userToken.create({
    data: { userId: user.id, refreshToken, accessToken },
  });
  ctx.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 864000000, // 10 days
    // only available for /api/auth
    path: "/api/auth",
  });
  ctx.body = {
    ...normalizeUser(user),
    avatar: user.profile?.avatar,
    token: accessToken,
  };
});

auth.post("/refresh", async (ctx) => {
  const refreshToken = ctx.cookies.get("refreshToken");
  if (!refreshToken) throw UnauthorizedError();
  const { database } = ctx.state;
  const record = await database.userToken.findFirst({
    where: { refreshToken },
    include: {
      user: true,
    },
  });
  if (!record) throw ForbiddenError();
  const { isError } = await verifyRefreshToken(refreshToken);
  if (isError) {
    ctx.cookies.set("refreshToken", "", {
      expires: new Date(0),
    });
    await database.userToken.delete({ where: { id: record.id } });
    throw UnauthorizedError("You need to login");
  }
  const accessToken = signAccessToken({
    id: record.user.id,
    username: record.user.username,
  });
  await database.userToken.update({
    where: { id: record.id },
    data: { accessToken },
  });
  ctx.body = { token: accessToken };
});

auth.post("/logout", async (ctx) => {
  const refreshToken = ctx.cookies.get("refreshToken");
  if (!refreshToken) throw UnauthorizedError();
  const { database } = ctx.state;
  const record = await database.userToken.findFirst({
    where: { refreshToken },
  });
  if (record) {
    await database.userToken.delete({ where: { id: record.id } });
  }
  ctx.status = 204;
});

export default auth;
