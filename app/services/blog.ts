import request from "@/utils/request";
import { useEffect } from "react";
import useFetchState from "./useFetchState";
import { useSelector } from "@/hooks/redux";
import { Blog } from "@/types";

type CreateBlogOption = {
  title: string;
  content: string;
};

export function useCreateBlog() {
  const token = useSelector((state) => state.user.token);

  const [state, fetchFn] = useFetchState<unknown, CreateBlogOption>(
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
  return { ...state, fetchFn };
}

type FetchBlogListOption = {
  index: number;
  size: number;
};

export function useBlogList(pageIndex: number, pageSize: number) {
  const [fetchState, fetchFn] = useFetchState<
    BlogListResponse,
    FetchBlogListOption
  >(
    {
      fetchFn: (args) =>
        request("/api/blog/list", {
          method: "get",
          headers: { "content-type": "application/json" },
          search: args,
        }),
    },
    [],
  );

  useEffect(() => {
    fetchFn({ index: pageIndex, size: pageSize });
  }, [pageIndex, pageSize]);
  return {
    ...fetchState,
    reload: () => fetchFn({ index: pageIndex, size: pageSize }),
  };
}

export function useBlogDetail(id: string) {
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
    fetchFn(id);
  }, [id]);
  return { ...fetchState, reload: () => fetchFn(id) };
}
