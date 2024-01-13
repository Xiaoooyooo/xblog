import Router from "koa-router";
import authentication, { AuthState } from "./middlewares/authentication";
import siteconfig, { SiteConfigState } from "~/middlewares/siteconfig";
import { AppContext, AppState } from "~/types";

const config = new Router({ prefix: "/siteconfig" });

config.get(
  "/",
  authentication({ force: true }),
  siteconfig(),
  async (ctx: AppContext<AuthState & SiteConfigState>) => {
    // const {} = ctx.state;
    // ctx.state;
    ctx.body = ctx.state.siteconfig;
  },
);

export default config;
