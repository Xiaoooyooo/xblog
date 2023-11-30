import Router from "koa-router";
import { AppState } from "~/types";
import { hash } from "~/utils/encrypt";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "~/errors";
import {
  signRefreshToken,
  signAccessToken,
  verifyRefreshToken,
} from "~/utils/jwt";
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
  const record = await database.userToken.findFirst({
    where: { refreshToken },
    include: { user: true },
  });
  if (!record) {
    ctx.cookies.set("refreshToken", "", { expires: new Date(0) });
    ctx.body = { isLogin: false };
    return;
  }
  const { isError } = await verifyRefreshToken(refreshToken);
  if (isError) {
    await database.userToken.delete({ where: { id: record.id } });
    ctx.cookies.set("refreshToken", "", { expires: new Date(0) });
    ctx.body = { isLogin: false };
    return;
  }
  const accessToken = signAccessToken(record.user);
  ctx.body = {
    id: record.user.id,
    displayName: record.user.displayName,
    username: record.user.username,
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
  const newUser = await database.user.create({
    data: { username, password: hash(password), displayName },
  });
  ctx.body = {
    id: newUser.id,
    displayName: newUser.displayName,
    username: newUser.username,
  };
});

auth.post("/login", async (ctx) => {
  const { database, body } = ctx.state;
  if (!body) throw BadRequestError();
  const { username, password } = body;
  if (!username) throw BadRequestError("username is needed");
  if (!password) throw BadRequestError("password is needed");
  const user = await database.user.findUnique({ where: { username } });
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
  });
  ctx.body = {
    id: user.id,
    displayName: user.displayName,
    username: user.username,
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
