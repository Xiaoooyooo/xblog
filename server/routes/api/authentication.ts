import Router from "koa-router";
import { AppState } from "~/types";
import { encryptPassword } from "~/utils/encrypt";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "~/errors";
import env from "~/env";

const auth = new Router<AppState>({
  prefix: "/auth",
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
    data: { username, password: encryptPassword(password), displayName },
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
  const _password = encryptPassword(password);
  if (_password !== user.password) {
    throw UnauthorizedError("Wrong username or password");
  }
  ctx.body = {
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    token: "",
  };
});

export default auth;
