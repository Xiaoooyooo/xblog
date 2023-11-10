export default {
  /** is production mode */
  isProduction: process.env.NODE_ENV === "production",
  /** can new user register */
  allowNewUerRegister: process.env.ALLOW_NEW_USER_REGISTER === "true",
};
