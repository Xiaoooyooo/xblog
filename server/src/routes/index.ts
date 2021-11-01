import Router from "koa-router";

import api from "./api";
import main from "./main";

const router = new Router();

router.use(main.routes());
// router.use(api.routes());

export default router;
