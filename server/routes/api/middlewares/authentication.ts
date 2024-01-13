import { Next } from "koa";
import { UnauthorizedError } from "~/errors";
import { AppContext, User } from "~/types";
import { verifyAccessToken } from "~/utils/jwt";
import { normalizeUser } from "~/utils/normalize";
import ROLE from "@@/constants/role";

type AuthenticationMiddlewareOptions = {
  force?: boolean;
};

export type AuthState = {
  user?: User & {
    isUser: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
  };
};

export default function authentication(
  options: AuthenticationMiddlewareOptions,
) {
  const { force } = options;
  return async function (ctx: AppContext<AuthState>, next: Next) {
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
            ...normalizeUser(user),
            isUser: user.role === ROLE.USER,
            isAdmin: user.role === ROLE.ADMIN || user.role === ROLE.SUPERADMIN,
            isSuperAdmin: user.role === ROLE.SUPERADMIN,
          };
        }
      }
    }
    return next();
  };
}
