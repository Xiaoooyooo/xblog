const Koa = require("koa");

const router = require("./routes");

const app = new Koa();

app.use(router.routes(), router.allowedMethods());

app.listen(2000, () => {
  console.log("app is runing at http://127.0.0.1:2000");
})