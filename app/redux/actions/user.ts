import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/services/request";
import { UserState } from "../reducers/user";

export const setUserInfo = createAction<Partial<UserState>>("user/setUesrInfo");

export const init = createAsyncThunk<UserState>("user/init", () => {
  return request("/api/auth");
});

export const login = createAsyncThunk<
  UserState,
  { username: string; password: string }
>(
  "user/login",
  (args, thunk) => {
    return request(
      "/api/auth/login",
      {
        method: "post",
        headers: { "content-type": "application/json" },
        data: args,
        signal: thunk.signal,
      },
      { noRefresh: true },
    );
  },
  {
    /**
     * only rejected error object matches following schema will be add to the final error object
     * ```ts
     * interface SerializedError {
     *   name?: string
     *   message?: string
     *   stack?: string
     *   code?: string
     * }
     * ```
     * we expect a message filed here
     */
    serializeError(x) {
      /* eslint-disable-next-line */
      return (x as any).error;
    },
  },
);
