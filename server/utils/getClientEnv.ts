import env from "~/env";

export default function getClientEnv() {
  return { __BEIAN__: env.BEIAN };
}
