import { useEffect } from "react";
import { getCategories, GetCategoryOption } from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List } from "@/types";

export function useGetCategories(
  pageIndex: number,
  pageSize: number,
  name: string,
  documents = false,
) {
  const [state, fetchFn] = useFetchState<List<Category>, GetCategoryOption>(
    {
      fetchFn: (arg) => getCategories(arg),
    },
    [],
  );

  useEffect(() => {
    fetchFn({ pageIndex, pageSize, name, documents });
  }, [pageIndex, pageSize, name, documents]);

  return { ...state, fetchFn };
}
