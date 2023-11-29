import dotenv from "dotenv";

dotenv.config();

class Environment {
  public isProduction = process.env.NODE_ENV === "production";
  public port = parseInt(process.env.PORT || "") || 80;
  /** disable or enable server route /api/auth/register */
  public allowNewUerRegister = process.env.ALLOW_NEW_USER_REGISTER === "true";
  /** secret for sign refresh token */
  public refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
  /** secret for sign access token */
  public accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
}

const env = new Environment();

export default env;
