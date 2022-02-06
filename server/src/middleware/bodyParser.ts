import { Context, Next } from "koa";

export default function bodyParser() {
  return async function(ctx: Context, next: Next) {
    const { req, method, headers } = ctx;
    if (method === "GET") {
      // 排除 multipart
      const isMultipart =
        headers["content-type"] && /multipart/.test(headers["content-type"]);
      if (!isMultipart) {
        ctx.state.body = await new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (chnuk) => {
            data += chnuk;
          });
          req.on("end", () => {
            resolve(
              headers["content-type"] === "application/json"
                ? JSON.parse(data)
                : data
            );
          });
        });
      }
    }
    return next();
  };
}