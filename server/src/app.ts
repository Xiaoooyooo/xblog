import Koa from "koa";

import errorHandling from "./middleware/errorHandling";
import bodyParser from "./middleware/bodyParser";
import staticServe from "./middleware/staticServe";
import router from "./routes";

const app = new Koa();

app.use(errorHandling());
app.use(staticServe());
app.use(bodyParser());
app.use(router.routes());

export default app;
