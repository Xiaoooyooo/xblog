import { createReducer } from "@reduxjs/toolkit";
import { User } from "@/types";
import { init, login, setUserInfo } from "../actions/user";

export type UserState = User & {
  isLogin: boolean;
  token: string;
  fetching: boolean;
};

const initialUserState: UserState = {
  id: "",
  username: "",
  displayName: "",
  token: "",
  avatar: "",
  isLogin: false,
  fetching: false,
  role: undefined,
};

const user = createReducer(initialUserState, (builder) => {
  builder
    .addCase(setUserInfo, (state, action) => {
      const { payload } = action;
      payload.displayName && (state.displayName = payload.displayName);
      payload.id && (state.id = payload.id);
      payload.username && (state.username = payload.username);
      payload.avatar && (state.avatar = payload.avatar);
      payload.token && (state.token = payload.token);
      payload.role && (state.role = payload.role);
      payload.isLogin && (state.isLogin = payload.isLogin);
    })
    .addCase(init.pending, (state) => {
      state.fetching = true;
    })
    .addCase(init.rejected, (state) => {
      state.fetching = false;
    })
    .addCase(init.fulfilled, (state, action) => {
      if (action.payload.isLogin) {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.displayName = action.payload.displayName;
        state.avatar = action.payload.avatar;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isLogin = true;
      }
      state.fetching = false;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.displayName = action.payload.displayName;
      state.avatar = action.payload.avatar;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isLogin = true;
    });
});

export default user;
