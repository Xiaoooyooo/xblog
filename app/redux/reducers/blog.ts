import { createReducer } from "@reduxjs/toolkit";
import { createBlogAction } from "../actions/blog";

const initialState = {};

export default createReducer(initialState, function (builder) {
  builder.addCase(createBlogAction.fulfilled, (state, action) => {});
});
