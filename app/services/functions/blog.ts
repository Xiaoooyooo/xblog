import request from "../request";
export function deleteBlog(id: string) {
  return request<boolean>("/api/blog/delete", {
    method: "delete",
    search: { id },
  });
}
