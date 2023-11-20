import { createReducer } from "@reduxjs/toolkit";
import { User } from "@/types";
import { init, login, setUserInfo } from "../actions/user";

export type UserState = User & {
  isLogin: boolean;
  token: string;
};

const initialUserState: UserState = {
  id: "",
  username: "",
  displayName: "",
  token: "",
  isLogin: false,
};

const user = createReducer(initialUserState, (builder) => {
  builder
    .addCase(setUserInfo, (state, action) => {
      const { payload } = action;
      payload.displayName && (state.displayName = payload.displayName);
      payload.id && (state.id = payload.id);
      payload.username && (state.username = payload.username);
      payload.token && (state.token = payload.token);
      payload.isLogin && (state.isLogin = payload.isLogin);
    })
    .addCase(init.fulfilled, (state, action) => {
      if (action.payload.isLogin) {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.displayName = action.payload.displayName;
        state.token = action.payload.token;
        state.isLogin = true;
      }
    })
    .addCase(login.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.displayName = action.payload.displayName;
      state.token = action.payload.token;
      state.isLogin = true;
    });
});

export default user;
