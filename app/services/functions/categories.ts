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

export type GetCategoryDocumentOption = {
  id: string;
  pageIndex: number;
  pageSize: number;
};

export function getCategoryDocuments(search: GetCategoryDocumentOption) {
  return request("/api/category/documents", {
    method: "get",
    search,
  });
}
