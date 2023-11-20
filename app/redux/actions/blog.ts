import { createAsyncThunk } from "@reduxjs/toolkit";
import { Blog } from "@/types";
import request from "@/services/request";

export type CreateBlogOption = {
  title: string;
  content: string;
};

export const createBlogAction = createAsyncThunk<Blog, CreateBlogOption>(
  "document/create",
  (args) => {
    return request("/document/create", { method: "post", data: args });
  },
);
