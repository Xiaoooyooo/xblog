import { useCallback, useEffect } from "react";
import BlogStore from "@/stores/BlogStore";
import useFetchState from "./useFetchState";

export default function useBlogWithId(id: string) {
  const [fetchState, setFetchState] = useFetchState(BlogStore.getDataById(id));
  const fetchHandler = useCallback((id: string) => {
    setFetchState({ error: false, loading: true, data: null });
    BlogStore.fetch(id)
      .then((blog) => {
        setFetchState({
          error: false,
          loading: false,
          data: blog,
        });
      })
      .catch(() => {
        setFetchState({ error: true, loading: false, data: null });
      });
  }, []);
  useEffect(() => {
    fetchHandler(id);
  }, [id]);
  return { ...fetchState, reload: () => fetchHandler(id) };
}
