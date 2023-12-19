import { useEffect, useMemo } from "react";
import { getUserProfile } from "./functions/user";
import useFetchState from "./useFetchState";
import { UserWithProfile } from "@/types";

export function useUserProfile(id: string) {
  const { fetchState, fetchFn, abortHandler } = useFetchState<
    UserWithProfile,
    string
  >(
    {
      fetchFn: (id, signal) => getUserProfile(id, signal),
    },
    [],
  );

  useEffect(() => {
    fetchFn(id);
  }, [id]);

  return useMemo(
    () => ({ ...fetchState, reload: () => fetchFn(id), abort: abortHandler }),
    [fetchState],
  );
}
