import request from "./request";
import { useEffect, useMemo } from "react";
import useFetchState from "./useFetchState";
import { useSelector } from "@/hooks/redux";
import { List, Blog } from "@/types";
import { getBlogList, GetBlogSearchOption } from "./functions/blog";

type CreateBlogOption = {
  title: string;
  content: string;
  isDraft?: boolean;
  categoriesId?: string[];
  createdCategories?: string[];
};

export function useCreateBlog() {
  const token = useSelector((state) => state.user.token);

  const { fetchState, fetchFn, abortHandler } = useFetchState<
    { id: string },
    CreateBlogOption
  >(
    {
      fetchFn: (data, signal) =>
        request("/api/blog/create", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data,
          signal,
        }),
    },
    [token],
  );

  return { ...fetchState, fetchFn, abort: abortHandler };
}

export function useUpdateBlog() {
  const token = useSelector((state) => state.user.token);

  const { fetchState, fetchFn, abortHandler } = useFetchState<
    { id: string },
    CreateBlogOption & { id: string }
  >(
    {
      fetchFn: (data, signal) =>
        request("/api/blog/update", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data,
          signal,
        }),
    },
    [token],
  );

  return { ...fetchState, fetchFn, abort: abortHandler };
}

export function useBlogList(options: GetBlogSearchOption) {
  const { fetchState, fetchFn, abortHandler } = useFetchState<
    List<Blog>,
    GetBlogSearchOption
  >(
    {
      fetchFn: (args, signal) => getBlogList(args, signal),
    },
    [],
  );

  useEffect(() => {
    fetchFn(options);
  }, [options]);

  return useMemo(
    () => ({
      ...fetchState,
      reload: () => fetchFn(options),
      abort: abortHandler,
    }),
    [fetchState, options],
  );
}

export function useBlogDetail(id?: string) {
  const { fetchState, fetchFn, abortHandler } = useFetchState<Blog, string>(
    {
      fetchFn: (id) =>
        request("/api/blog/detail", {
          method: "get",
          search: { id },
        }),
    },
    [],
  );

  useEffect(() => {
    id && fetchFn(id);
  }, [id]);

  return useMemo(
    () => ({
      ...fetchState,
      reload: () => id && fetchFn(id),
      abort: abortHandler,
    }),
    [fetchState, id],
  );
}
