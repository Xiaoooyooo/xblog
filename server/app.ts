import Koa from "koa";

import router from "./routes";
import errorHandler from "./middlewares/errorHandler";
import renderApp from "./middlewares/renderApp";

const app = new Koa();

app.use(errorHandler());
app.use(router.routes());
app.use(router.allowedMethods());
// all unknown request fallback to index page
app.use(renderApp());

export default app;
