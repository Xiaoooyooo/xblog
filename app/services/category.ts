import { useEffect, useCallback } from "react";
import {
  getCategories,
  GetCategoryOption,
  getCategoryDetail,
  getCategoryDocuments,
  GetCategoryDocumentOption,
} from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List, Blog } from "@/types";

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

  return { ...state, fetchFn };
}

export function useGatCategoryDocuments(
  id: string,
  pageIndex: number,
  pageSize: number,
) {
  const [state, fetchFn] = useFetchState<List<Blog>, GetCategoryDocumentOption>(
    {
      fetchFn: getCategoryDocuments,
    },
    [],
  );

  const fetchHandler = useCallback(() => {
    fetchFn({ id, pageIndex, pageSize });
  }, [id, pageIndex, pageSize]);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  return { ...state, reload: fetchHandler };
}
