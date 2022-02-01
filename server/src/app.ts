import Koa from "koa";
import body from "koa-body";

import errorHandling from "./middleware/errorHandling";
import router from "./routes";

const app = new Koa();

app.use(body());
app.use(errorHandling());
app.use(router.routes());

export default app;
