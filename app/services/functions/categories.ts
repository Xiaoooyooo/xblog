import request from "../request";

import { Category, List } from "@/types";

export type GetCategoryOption = {
  name: string;
  pageIndex: number;
  pageSize: number;
  documents?: boolean;
};

export function getCategories(search: GetCategoryOption) {
  return request<List<Category>>("/api/category/list", {
    method: "get",
    search,
  });
}

export function getCategoryDetail(id: string) {
  return request("/api/category/detail", {
    method: "get",
    search: { id },
  });
}

export function deleteCategory(id: string, token: string) {
  return request<boolean>("/api/category/delete", {
    method: "delete",
    search: { id },
    headers: { Authorization: `Bearer ${token}` },
  });
}
