import { useEffect, useCallback } from "react";
import BlogStore from "@/stores/BlogStore";
import useFetchState from "./useFetchState";

export default function useBlogsWithPage(pageIndex: number, pageSize: number) {
  const [fetchState, setFetchState] = useFetchState<BlogListResponse>();
  const fetchHandler = useCallback((pageIndex: number, pageSize: number) => {
    setFetchState({ error: false, loading: true, data: null });
    BlogStore.fetchListByPage(pageIndex, pageSize)
      .then((list) => {
        setFetchState({ error: false, loading: false, data: list });
      })
      .catch((err) => {
        console.log(err);
        setFetchState({ error: true, loading: false, data: null });
      });
  }, []);
  useEffect(() => {
    fetchHandler(pageIndex, pageSize);
  }, [pageIndex, pageSize]);
  return { ...fetchState, reload: () => fetchHandler(pageIndex, pageSize) };
}
