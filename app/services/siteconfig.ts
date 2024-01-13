import { useSelector } from "@/hooks/redux";
import useFetchState from "./useFetchState";
import { getSiteConfig, updateSiteConfig } from "./functions/siteconfig";
import { SiteConfig } from "@/types";
import { useEffect } from "react";

export function useSiteConfig() {
  const token = useSelector((state) => state.user.token);

  const { fetchState, fetchFn, abortHandler } = useFetchState<SiteConfig>(
    {
      fetchFn(args, signal) {
        return getSiteConfig(token, signal);
      },
    },
    [token],
  );

  useEffect(() => {
    fetchFn(token);
  }, []);

  return { ...fetchState, reload: fetchFn, abort: abortHandler };
}

export function useUpdateSiteConfig() {
  const token = useSelector((state) => state.user.token);

  const { fetchState, fetchFn, abortHandler } = useFetchState<
    SiteConfig,
    SiteConfig
  >(
    {
      fetchFn(args, signal) {
        return updateSiteConfig(args, token, signal);
      },
    },
    [token],
  );

  return { ...fetchState, fetchFn, abort: abortHandler };
}
