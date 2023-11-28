import Router from "koa-router";
import api from "./api";
import assets from "./assets";

const router = new Router();

router.use(api.routes(), api.allowedMethods());
router.use(assets.routes(), assets.allowedMethods());

export default router;
