import Router from "koa-router";
import authentication, { AuthState } from "./middlewares/authentication";
import siteconfig, { SiteConfigState } from "~/middlewares/siteconfig";
import { AppContext } from "~/types";
import ROLE from "@@/constants/role";
import { BadRequestError, ForbiddenError } from "~/errors";
import { normalizeSiteConfig } from "~/utils/normalize";

const config = new Router({ prefix: "/siteconfig" });

config.get(
  "/",
  authentication({ force: true }),
  siteconfig(),
  async (ctx: AppContext<AuthState & SiteConfigState>) => {
    const user = ctx.state.user!;
    if (user.role !== ROLE.SUPERADMIN) {
      throw ForbiddenError();
    }
    ctx.body = normalizeSiteConfig(ctx.state.siteconfig);
  },
);

config.post(
  "/",
  authentication({ force: true }),
  async (ctx: AppContext<AuthState>) => {
    const user = ctx.state.user!;
    if (user.role !== ROLE.SUPERADMIN) {
      throw ForbiddenError();
    }
    const { allowRegister } = ctx.state.body;
    if (typeof allowRegister !== "boolean") {
      throw BadRequestError;
    }
    const config = await ctx.state.database.siteConfig.set({ allowRegister });
    ctx.body = normalizeSiteConfig(config);
  },
);

export default config;
