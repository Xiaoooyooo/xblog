import { useState } from "react";

export default function useFetchState<T = unknown>(initialData?: T) {
  const [fetchState, setFetchState] = useState<{
    error: boolean;
    loading: boolean;
    data: T | null;
  }>({
    error: false,
    loading: false,
    data: initialData || null,
  });
  return [fetchState, setFetchState] as const;
}
