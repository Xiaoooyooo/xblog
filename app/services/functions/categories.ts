import request from "../request";

import { Category, List } from "@/types";

export type GetCategoryOption = {
  name: string;
  pageIndex: number;
  pageSize: number;
};

export function getCategories(search: GetCategoryOption) {
  return request<List<Category>>("/api/category/list", {
    method: "get",
    search,
  });
}
