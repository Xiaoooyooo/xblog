import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "store";

import request from "utils/request";

export interface BlogStore {
  data: Blog[]
}
const initailBlogState: BlogStore = {
  data: [],
};

// async actions
export const fetchBlogById = createAsyncThunk(
  "blog/setBlog",
  async (blogId: string) => {
    const blog = await request(`blog.info?blogId=${blogId}`);
    console.log(blog);
    return blog;
  }
);

const blog = createSlice({
  name: "blog",
  initialState: initailBlogState,
  reducers: {
    removeBlog: function(state, action: PayloadAction<string>) {
      state.data.filter(blog => blog.id !== action.payload);
    }
  },
  extraReducers: {
    [fetchBlogById.fulfilled as any]: function(
      state,
      action: PayloadAction<Blog>
    ) {
      const { payload } = action;
      state.data.push(payload);
    },
  }
});

export const getBlogById = (state: BlogStore, blogId: string) =>
  state.data.find(blog => blog.id === blogId);

export const { removeBlog } = blog.actions;

export default blog.reducer;
