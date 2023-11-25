import request from "../request";

import { Category, List } from "@/types";

type GetCategoryOption = {
  name: string;
};

export function getCategories(search: GetCategoryOption) {
  return request<List<Category>>("/api/category/list", {
    method: "get",
    search,
  });
}
