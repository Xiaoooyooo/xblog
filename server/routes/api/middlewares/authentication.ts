import { Middleware } from "koa";
import { UnauthorizedError } from "~/errors";
import { AppState, User } from "~/types";
import { verifyAccessToken } from "~/utils/jwt";

type AuthenticationMiddlewareOptions = {
  force?: boolean;
};

export default function authentication(
  options: AuthenticationMiddlewareOptions,
): Middleware<AppState & { user?: User }> {
  const { force } = options;
  return async function (ctx, next) {
    const authorizationHeader = ctx.headers.authorization || "";
    const [schema, token] = authorizationHeader.split(" ");
    if (force) {
      /** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#bearer */
      if (schema !== "Bearer") throw UnauthorizedError();
      if (!token) throw UnauthorizedError();
    }
    if (token) {
      const result = await verifyAccessToken(token);
      if (force && result.isError) {
        throw UnauthorizedError();
      }
      if (result.isSuccess) {
        const { id, username } = result.payload;
        const { database } = ctx.state;
        const user = await database.user.findUnique({
          where: { id, username },
        });
        if (force && !user) {
          throw UnauthorizedError();
        }
        if (user) {
          ctx.state.user = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin || false,
          };
        }
      }
    }
    return next();
  };
}
