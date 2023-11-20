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
    isError: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    isSuccess: boolean;
    result: T | null;
    isLoading: boolean;
  }>({
    isError: false,
    error: null,
    isSuccess: false,
    result: option.initialData || null,
    isLoading: false,
  });

  const fetchFn = useCallback(
    (args: P) => {
      setFetchState({
        isError: false,
        error: null,
        isSuccess: false,
        result: null,
        isLoading: true,
      });
      option
        .fetchFn(args)
        .then((res) => {
          setFetchState({
            isError: false,
            error: null,
            isSuccess: true,
            result: res,
            isLoading: false,
          });
        })
        .catch((error) => {
          setFetchState({
            isError: true,
            error: error,
            isSuccess: false,
            result: null,
            isLoading: false,
          });
        });
    },
    [deps],
  );

  return [fetchState, fetchFn] as const;
}
