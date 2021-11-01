import Router from "koa-router";

import account from "./account";

const api = new Router({
  prefix: "/api"
});

api.use(account.routes(), account.allowedMethods());

export default api;