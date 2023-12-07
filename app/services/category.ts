import { useEffect, useMemo } from "react";
import {
  getCategories,
  GetCategoryOption,
  getCategoryDetail,
} from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List } from "@/types";

export function useGetCategories(option: GetCategoryOption) {
  const [state, fetchFn] = useFetchState<List<Category>, GetCategoryOption>(
    {
      fetchFn: (arg) => getCategories(arg),
    },
    [],
  );

  useEffect(() => {
    fetchFn(option);
  }, [option]);

  const memoized = useMemo(
    () => ({ ...state, reload: () => fetchFn(option) }),
    [state, option],
  );

  return memoized;
}

export function useCategoryDetail(id: string) {
  const [state, fetchFn] = useFetchState<Category, string>(
    {
      fetchFn: getCategoryDetail,
    },
    [],
  );

  useEffect(() => {
    fetchFn(id);
  }, [id]);

  const memoized = useMemo(
    () => ({ ...state, reload: () => fetchFn(id) }),
    [state, id],
  );

  return memoized;
}
