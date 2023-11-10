import mock from "mockjs";
import * as blogs from "./blogs";

mock.setup({ timeout: "10-1000" });

mock.mock(/\/api\/blog\.list$/, "post", blogs.blogList);
mock.mock(/\/api\/blog\.info$/, "post", blogs.blogInfo);
