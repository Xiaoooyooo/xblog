import { Context, Next } from "koa";
import path from "path";
import { isFileExists } from "~/utils/fs";
import sendFile from "~/utils/sendFile";

const indexPath = path.join(__dirname, "../../app/index.html");

export default function renderApp() {
  return async function (ctx: Context, next: Next) {
    const stats = await isFileExists(indexPath);
    // ctx.body = fs.createReadStream(indexPath);
    if (!stats) {
      return next();
    }
    sendFile({
      context: ctx,
      filename: indexPath,
      stats,
    });
  };
}
