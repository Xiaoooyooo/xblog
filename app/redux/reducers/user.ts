import { createReducer } from "@reduxjs/toolkit";
import { UserInfo } from "@/types";
import { login } from "../actions/user";

const initialUserState: UserInfo = {
  id: "",
  username: "",
  displayName: "",
  token: "",
  isLogin: false,
};

const user = createReducer(initialUserState, (builder) => {
  builder.addCase(login.fulfilled, (state, action) => {
    state.id = action.payload.id;
    state.username = action.payload.username;
    state.displayName = action.payload.displayName;
    state.token = action.payload.token;
    state.isLogin = true;
  });
});

export default user;
