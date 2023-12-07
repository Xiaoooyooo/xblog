import request from "./request";
import { useEffect, useMemo } from "react";
import useFetchState from "./useFetchState";
import { useSelector } from "@/hooks/redux";
import { Blog } from "@/types";
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

  const [state, fetchFn] = useFetchState<{ id: string }, CreateBlogOption>(
    {
      fetchFn: (data) =>
        request("/api/blog/create", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data,
        }),
    },
    [token],
  );

  const memoized = useMemo(() => ({ ...state, fetchFn }), [state]);

  return memoized;
}

export function useUpdateBlog() {
  const token = useSelector((state) => state.user.token);

  const [state, fetchFn] = useFetchState<
    { id: string },
    CreateBlogOption & { id: string }
  >(
    {
      fetchFn: (data) =>
        request("/api/blog/update", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data,
        }),
    },
    [token],
  );

  const memoized = useMemo(() => ({ ...state, fetchFn }), [state]);

  return memoized;
}

export function useBlogList(options: GetBlogSearchOption) {
  const [fetchState, fetchFn] = useFetchState<
    BlogListResponse,
    GetBlogSearchOption
  >(
    {
      fetchFn: (args) => getBlogList(args),
    },
    [],
  );

  useEffect(() => {
    fetchFn(options);
  }, [options]);

  const memoized = useMemo(
    () => ({ ...fetchState, reload: () => fetchFn(options) }),
    [fetchState, options],
  );

  return memoized;
}

export function useBlogDetail(id?: string) {
  const [fetchState, fetchFn] = useFetchState<Blog, string>(
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

  const memoized = useMemo(
    () => ({ ...fetchState, reload: () => id && fetchFn(id) }),
    [fetchState, id],
  );

  return memoized;
}
