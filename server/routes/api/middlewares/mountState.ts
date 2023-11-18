import { Middleware } from "koa";
import { prisma } from "~/database";
import { AppState } from "~/types";

export default function mountState(): Middleware<AppState> {
  return function (ctx, next) {
    ctx.state.body = ctx.request.body;
    ctx.state.database = prisma;
    return next();
  };
}
