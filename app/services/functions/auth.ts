import request from "../request";

type AuthOption = {
  username: string;
  password: string;
};

export function register(data: AuthOption) {
  return request("/api/auth/register", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    data,
  });
}
