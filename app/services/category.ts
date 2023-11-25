import { useEffect } from "react";
import { getCategories } from "./functions/categories";
import useFetchState from "./useFetchState";
import { Category, List } from "@/types";

type useGetCategoriesOption = {
  name: string;
};

export function useGetCategories() {
  const [state, fetchFn] = useFetchState<
    List<Category>,
    useGetCategoriesOption
  >(
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
