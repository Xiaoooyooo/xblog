import { useEffect, useMemo } from "react";
import {
  getCategories,
  GetCategoryOption,
  getCategoryDetail,
} from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List } from "@/types";

export function useGetCategories(option: GetCategoryOption) {
  const { fetchState, fetchFn, abortHandler } = useFetchState<
    List<Category>,
    GetCategoryOption
  >(
    {
      fetchFn: (arg, signal) => getCategories(arg, signal),
    },
    [],
  );

  useEffect(() => {
    fetchFn(option);
  }, [option]);

  return useMemo(
    () => ({
      ...fetchState,
      reload: () => fetchFn(option),
      abort: abortHandler,
    }),
    [fetchState, option],
  );
}

export function useCategoryDetail(id: string) {
  const { fetchState, fetchFn, abortHandler } = useFetchState<Category, string>(
    {
      fetchFn: getCategoryDetail,
    },
    [],
  );

  useEffect(() => {
    fetchFn(id);
  }, [id]);

  return useMemo(
    () => ({ ...fetchState, reload: () => fetchFn(id), abort: abortHandler }),
    [fetchState, id],
  );
}
