export default {
  /** is production mode */
  isProduction: process.env.NODE_ENV === "production",
  /** can new user register */
  allowNewUerRegister: process.env.ALLOW_NEW_USER_REGISTER === "true",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
};
