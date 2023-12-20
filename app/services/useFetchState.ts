import { useState, useCallback, useRef } from "react";

type UseFetchStateOption<T = unknown, P = unknown> = {
  initialData?: T;
  fetchFn: (args: P, signal: AbortSignal) => Promise<T>;
};

export type FetchState<T> =
  | {
      isLoading: false;
      isError: false;
      error: null;
      isSuccess: false;
      result: T | null;
    }
  | {
      isLoading: true;
      isError: false;
      error: null;
      isSuccess: false;
      result: null;
    }
  | {
      isLoading: false;
      isError: true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
      isSuccess: false;
      result: null;
    }
  | {
      isLoading: false;
      isError: false;
      error: null;
      isSuccess: true;
      result: T;
    };

export default function useFetchState<T = unknown, P = unknown>(
  option: UseFetchStateOption<T, P>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
) {
  const [fetchState, setFetchState] = useState<FetchState<T>>({
    isError: false,
    error: null,
    isSuccess: false,
    result: option.initialData || null,
    isLoading: false,
  });
  const abortController = useRef<AbortController>();

  const fetchFn = useCallback(
    async (args: P) => {
      setFetchState({
        isError: false,
        error: null,
        isSuccess: false,
        result: null,
        isLoading: true,
      });
      abortController.current = new AbortController();
      return option
        .fetchFn(args, abortController.current.signal)
        .then((res) => {
          const state = {
            isError: false,
            error: null,
            isSuccess: true,
            result: res,
            isLoading: false,
          } as const;
          setFetchState(state);
          abortController.current = undefined;
          return state;
        })
        .catch((error) => {
          const state = {
            isError: true,
            error: error,
            isSuccess: false,
            result: null,
            isLoading: false,
          } as const;
          setFetchState(state);
          abortController.current = undefined;
          return state;
        });
    },
    [deps],
  );

  const abortHandler = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  return { fetchState, fetchFn, abortHandler } as const;
}
