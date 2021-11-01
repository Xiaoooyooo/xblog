import Koa from "koa";

import errorHandling from "./middleware/errorHandling";
import router from "./routes";

const app = new Koa();

app.use(errorHandling());
app.use(router.routes());

export default app;
