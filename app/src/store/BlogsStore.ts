import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import request from "utils/request";

interface BlogStore {
  status: "idle" | "loading" | "succeeded" | "error";
  data: Blog[];
}
const initailBlogState: BlogStore = {
  status: "idle",
  data: [],
};

// async actions
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlog",
  async (blogId: string) => {
    const blog: XhrResponse<Blog> =
      await request(`blog.info?blogId=${blogId}`);
    console.log("fecth blog res:", blog);
    return blog.data;
  }
);

const blog = createSlice({
  name: "blog",
  initialState: initailBlogState,
  reducers: {
    addBlog: (state, action: PayloadAction<Blog>) => {
      const { payload } = action;
      state.data.push(payload);
    },
    removeBlog: function(state, action: PayloadAction<string>) {
      state.data =
        state.data.filter(blog => blog.id !== action.payload);
    }
  },
  extraReducers: {
    [fetchBlogById.pending.toString()]: (state) => {
      state.status = "loading";
    },
    [fetchBlogById.fulfilled.toString()]: function(
      state,
      action: PayloadAction<Blog>
    ) {
      const { payload } = action;
      state.status = "succeeded";
      state.data.push(payload);
    },
    [fetchBlogById.rejected.toString()]: (
      state,
      action: PayloadAction<XhrResponse>
    ) => {
      state.status = "error";
      console.log(action);
    }
  }
});

export const { addBlog, removeBlog } = blog.actions;

export default blog.reducer;
