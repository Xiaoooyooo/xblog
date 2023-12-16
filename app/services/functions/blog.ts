import request from "../request";

export type GetBlogSearchOption = {
  pageIndex: number;
  pageSize: number;
  keywords?: string;
  categoryId?: string;
  draft?: boolean;
};

export function getBlogList(search: GetBlogSearchOption, signal: AbortSignal) {
  return request("/api/blog/list", {
    method: "get",
    search,
    signal,
  });
}

export function deleteBlog(id: string, token: string, signal?: AbortSignal) {
  return request<boolean>("/api/blog/delete", {
    method: "delete",
    search: { id },
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
}
