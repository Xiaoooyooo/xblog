import Router from "koa-router";
import formidable, { Files } from "formidable";
import path from "path";
import mime from "mime";
import { AppContext } from "~/types";
import env from "~/env";
import { BadRequestError, InternalServerError } from "~/errors";
import { moveFile, removeFile, tryToCreateDir } from "~/utils/fs";
import authentication, { AuthState } from "./middlewares/authentication";

const upload = new Router({ prefix: "/upload" });

type UploadContext<T = unknown> = AppContext<{ files: Files } & T>;

upload.use(async (ctx: UploadContext, next) => {
  const form = formidable();
  try {
    const [, files] = await form.parse(ctx.req);
    ctx.state.files = files;
    return next();
  } catch (err) {
    throw InternalServerError();
  }
});

upload.post(
  "/avatar",
  authentication({ force: true }),
  async (ctx: UploadContext<AuthState>) => {
    const { files } = ctx.state;
    const avatar = files.avatar?.[0];
    if (!avatar) {
      throw BadRequestError();
    }
    if (!avatar.mimetype || !/^image\//.test(avatar.mimetype)) {
      throw BadRequestError("wrong file mimetype");
    }
    const ext = mime.getExtension(avatar.mimetype);
    const uploadDir = path.resolve(env.CWD, env.avatarUploadDir);
    await tryToCreateDir(uploadDir);
    const newFilename = `${avatar.newFilename}.${ext}`;
    const newFilepath = path.join(uploadDir, newFilename);
    await moveFile(avatar.filepath, newFilepath);
    const { database } = ctx.state;
    const user = ctx.state.user!;
    const profile = await database.userProfile.findUnique({
      where: { userId: user.id },
    });
    if (profile?.avatar) {
      // remove old avatar
      const oldAvatar = path.join(uploadDir, profile.avatar);
      await removeFile(oldAvatar);
    }
    await database.userProfile.update({
      where: { userId: user.id },
      data: { avatar: newFilename },
    });
    ctx.body = { avatar: newFilename };
  },
);

export default upload;
