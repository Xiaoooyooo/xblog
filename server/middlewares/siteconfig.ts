import { Next } from "koa";
import { AppContext } from "~/types";
import { prisma } from "~/database";

type SiteConfig = Awaited<ReturnType<typeof prisma.siteConfig.get>>;

export type SiteConfigState = { siteconfig: SiteConfig };

export default function siteconfig() {
  return async function (ctx: AppContext<SiteConfigState>, next: Next) {
    const siteconfig = await ctx.state.database.siteConfig.get();
    ctx.state.siteconfig = siteconfig;
    return next();
  };
}
