import { createReducer } from "@reduxjs/toolkit";
import { User } from "@/types";
import { init, login } from "../actions/user";

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
