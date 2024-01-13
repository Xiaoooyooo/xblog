import dotenv from "dotenv";

dotenv.config();

const cwd = process.cwd();

class Environment {
  /** current working directory */
  public CWD = cwd;
  public isProduction = process.env.NODE_ENV === "production";
  public port = parseInt(process.env.PORT || "80");
  /** secret for sign refresh token */
  public refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
  /** secret for sign access token */
  public accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
  /** user avatar storage directory, relative to `CWD` */
  public avatarUploadDir = process.env.AVATAR_UPLOAD_DIR || "./upload/avatar";
}

const env = new Environment();

export default env;
