import Koa from "koa";

import router from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = new Koa();
console.log(process.env.ALLOW_NEW_USER_REGISTER);
app.use(errorHandler());
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = "<h1>Not Found</h1>";
  }
});

export default app;
