import request from "../request";

export type GetBlogSearchOption = {
  pageIndex: number;
  pageSize: number;
  keywords?: string;
  categoryId?: string;
};

export function getBlogList(search: GetBlogSearchOption) {
  return request("/api/blog/list", {
    method: "get",
    search,
  });
}

export function deleteBlog(id: string, token: string) {
  return request<boolean>("/api/blog/delete", {
    method: "delete",
    search: { id },
    headers: { Authorization: `Bearer ${token}` },
  });
}
