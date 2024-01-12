import { Next } from "koa";
import { prisma } from "~/database";
import { AppContext } from "~/types";

declare module "koa" {
  interface Request {
    /* eslint-disable-next-line */
    body?: any;
  }
}

export default function mountState() {
  return function (ctx: AppContext, next: Next) {
    ctx.state.body = ctx.request.body;
    ctx.state.database = prisma;
    return next();
  };
}
