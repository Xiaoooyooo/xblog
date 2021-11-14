import Koa from "koa";

import errorHandling from "./middleware/errorHandling";
import router from "./routes";
import { isProd } from "./env";

const app = new Koa();

if (!isProd) {
  app.use(async (ctx, next) => {
    ctx.set("access-control-allow-origin", "*");
    return next();
  });
}

app.use(errorHandling());
app.use(router.routes());

export default app;
