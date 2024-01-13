import request from "../request";

import { Category, List } from "@/types";

export type GetCategoryOption = {
  name: string;
  pageIndex: number;
  pageSize: number;
  documents?: boolean;
};

export function getCategories(search: GetCategoryOption, signal?: AbortSignal) {
  return request<List<Category>>("/api/category/list", {
    method: "get",
    search,
    signal,
  });
}

export function getCategoryDetail(id: string, signal: AbortSignal) {
  return request("/api/category/detail", {
    method: "get",
    search: { id },
    signal,
  });
}

export function deleteCategory(
  id: string,
  token: string,
  signal?: AbortSignal,
) {
  return request<boolean>("/api/category/delete", {
    method: "delete",
    search: { id },
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
}
