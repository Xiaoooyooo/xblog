import jwt from "jsonwebtoken";
import env from "~/env";

type TokenPayload = {
  id: string;
  username: string;
};

type VerifyResult<T> =
  | {
      isError: true;
      isSuccess: false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
    }
  | {
      isError: false;
      isSuccess: true;
      payload: T;
    };

function sign(user: TokenPayload, secret: string, options: jwt.SignOptions) {
  const { id, username } = user;
  return jwt.sign({ id, username }, secret, options);
}

function verify<T>(token: string, secret: string) {
  return new Promise<VerifyResult<T>>((resolve) => {
    jwt.verify(token, secret, (err, payload) => {
      let result: VerifyResult<T>;
      if (err) {
        result = {
          isError: true,
          isSuccess: false,
          error: err,
        };
      } else {
        result = {
          isError: false,
          isSuccess: true,
          payload: payload as T,
        };
      }
      resolve(result);
    });
  });
}

export function decode(token: string) {
  return jwt.decode(token);
}

export function signRefreshToken(user: TokenPayload) {
  return sign(
    { id: user.id, username: user.username },
    env.refreshTokenSecret,
    { expiresIn: "7d" },
  );
}

export function signAccessToken(user: TokenPayload) {
  return sign({ id: user.id, username: user.username }, env.accessTokenSecret, {
    expiresIn: "10m",
  });
}

export function verifyRefreshToken(token: string) {
  return verify<TokenPayload>(token, env.refreshTokenSecret);
}

export function verifyAccessToken(token: string) {
  return verify<TokenPayload>(token, env.accessTokenSecret);
}
