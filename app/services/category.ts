import { useEffect } from "react";
import { getCategories, GetCategoryOption } from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List } from "@/types";

export function useGetCategories() {
  const [state, fetchFn] = useFetchState<List<Category>, GetCategoryOption>(
    {
      fetchFn: (arg) => getCategories(arg),
    },
    [],
  );

  // useEffect(() => {
  //   fetchFn(option);
  // }, [option]);

  return { ...state, fetchFn };
}
