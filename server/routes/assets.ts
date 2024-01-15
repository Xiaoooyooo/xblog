import Router from "koa-router";
import path from "path";
import env from "~/env";
import { isFileExists } from "~/utils/fs";
import sendFile from "~/utils/sendFile";

const assets = new Router();

const assetsDir = path.join(__dirname, "../../app");
const avatarDir = path.resolve(process.cwd(), env.avatarUploadDir);

assets.get("/assets/avatar/:filename", async (ctx, next) => {
  const { filename } = ctx.params;
  const avatarPath = path.join(avatarDir, filename);
  const avatarStats = await isFileExists(avatarPath);
  if (!avatarStats) {
    return next();
  }
  sendFile({ context: ctx, filename: avatarPath, stats: avatarStats });
});

assets.get("(.*)", async (ctx, next) => {
  const filename = path.join(assetsDir, ctx.path);
  const filestats = await isFileExists(filename);
  if (!filestats) {
    return next();
  }
  sendFile({ context: ctx, filename, stats: filestats });
});

export default assets;
