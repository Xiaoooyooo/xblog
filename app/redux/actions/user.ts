import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import request from "@/utils/request";
import { UserInfo } from "@/types";

export const setUserInfo = createAction("user/setUesrInfo");
export const login = createAsyncThunk<
  UserInfo,
  { username: string; password: string }
>("user/login", (args, thunk) => {
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
   * we expected a message filed here
   */
  return request("/api/auth/login", {
    method: "post",
    headers: { "content-type": "application/json" },
    data: args,
    signal: thunk.signal,
  });
});
