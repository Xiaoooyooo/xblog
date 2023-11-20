import BaseStore from "./base";
import request from "@/services/request";

class BlogStore extends BaseStore<Blog> {
  fetch(id: string) {
    __DEV__ && console.log("fetch blog info by id", id);
    return request<Blog>("/api/blog.info", {
      method: "post",
      data: { id },
    }).then((res) => {
      this.data.set(id, res);
      return res;
    });
  }
  fetchListByPage(pageIndex: number, pageSize: number) {
    __DEV__ && console.log("fetchListByPage");
    return request<BlogListResponse>("/api/blog.list", {
      method: "post",
      data: { pageIndex, pageSize },
    }).then((res) => {
      console.log({ res });
      return res;
    });
  }
}

export default new BlogStore();
