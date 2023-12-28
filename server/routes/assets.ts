import Router from "koa-router";
import path from "path";
import env from "~/env";
import { isFileExists } from "~/utils/fs";
import sendFile from "~/utils/sendFile";

const assets = new Router({ prefix: "/assets" });

const assetsDir = path.join(__dirname, "../../app/assets");
const avatarDir = path.resolve(process.cwd(), env.avatarUploadDir);

assets.get("/avatar/:filename", async (ctx, next) => {
  const { filename } = ctx.params;
  const avatarPath = path.join(avatarDir, filename);
  const avatarStats = await isFileExists(avatarPath);
  if (!avatarStats) {
    return next();
  }
  sendFile(ctx, avatarStats, avatarPath);
});

assets.get("(.*)", async (ctx, next) => {
  const filename = ctx.path.replace(/^\/assets/, "");
  const filepath = path.join(assetsDir, filename);
  const filestats = await isFileExists(filepath);
  if (!filestats) {
    return next();
  }
  sendFile(ctx, filestats, filepath);
});

export default assets;
