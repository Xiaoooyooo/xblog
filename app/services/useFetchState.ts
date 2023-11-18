import { useState, useCallback } from "react";

type UseFetchStateOption<T = unknown, P = unknown> = {
  initialData?: T;
  fetchFn: (args: P) => Promise<T>;
};

export default function useFetchState<T = unknown, P = unknown>(
  option: UseFetchStateOption<T, P>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
) {
  const [fetchState, setFetchState] = useState<{
    error: boolean;
    loading: boolean;
    data: T | null;
  }>({
    error: false,
    loading: false,
    data: option.initialData || null,
  });

  const fetchFn = useCallback(
    (args: P) => {
      setFetchState({ error: false, data: null, loading: true });
      option
        .fetchFn(args)
        .then((res) => {
          setFetchState({ error: false, data: res, loading: false });
        })
        .catch((error) => {
          setFetchState({ error: error, data: null, loading: false });
        });
    },
    [deps],
  );

  return [fetchState, fetchFn] as const;
}
