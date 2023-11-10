import jwt from "jsonwebtoken";
import env from "~/env";
import { User } from "~/types";

function sign(
  user: Pick<User, "id" | "username">,
  secret: string,
  options: jwt.SignOptions,
) {
  const { id, username } = user;
  return jwt.sign({ id, username }, secret, options);
}

type VerifyResult = {
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

function verify(token: string, secret: string) {
  return new Promise<VerifyResult>((resolve) => {
    jwt.verify(token, secret, (err, payload) => {
      const result: VerifyResult = {
        isError: false,
        error: null,
        isSuccess: false,
        payload: null,
      };
      if (err) {
        result.isError = true;
        result.error = err;
      } else {
        result.isSuccess = true;
        result.payload = payload;
      }
      resolve(result);
    });
  });
}

export function decode(token: string) {
  return jwt.decode(token);
}

export function signRefreshToken(user: Pick<User, "id" | "username">) {
  return sign(user, env.refreshTokenSecret, { expiresIn: "7d" });
}

export function signAccessToken(user: Pick<User, "id" | "username">) {
  return sign(user, env.accessTokenSecret, { expiresIn: "10m" });
}

export function verifyRefreshToken(token: string) {
  return verify(token, env.refreshTokenSecret);
}

export function verifyAccessToken(token: string) {
  return verify(token, env.accessTokenSecret);
}
