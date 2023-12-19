import Router from "koa-router";
import fs from "fs";
import path from "path";
import env from "~/env";
import { isFileExits } from "~/utils/fs";
import { forceCache, validationCache } from "~/utils/clientCache";

const assets = new Router({ prefix: "/assets" });

const appDir = "../../app/assets";
const avatarDir = path.resolve(process.cwd(), env.avatarUploadDir);

assets.get("/avatar/:filename", async (ctx, next) => {
  const { filename } = ctx.params;
  if (!filename) {
    return next();
  }
  const avatarPath = path.join(avatarDir, filename);
  const avatarStats = await isFileExits(avatarPath);
  if (!avatarStats) {
    return next();
  }
  forceCache(ctx, avatarStats, avatarPath);
  ctx.body = fs.createReadStream(avatarPath);
});

assets.get("(.*)", async (ctx, next) => {
  try {
    const filename = ctx.path.replace(/^\/assets/, "");
    const filepath = path.join(__dirname, appDir, filename);
    const isExists = fs.existsSync(filepath);
    if (!isExists) {
      return next();
    }
    const filestats = fs.statSync(filepath);
    if (!filestats.isFile()) {
      return next();
    }
    validationCache(ctx, filestats, filepath);
    ctx.body = fs.createReadStream(filepath);
  } catch (err) {
    console.log(err);
    return next();
  }
});

export default assets;
