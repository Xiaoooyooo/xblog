import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

function wrap<T extends AnyFunction>(fn?: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    fn?.(...args);
  } as T;
}

export default function useFunctionRef<T extends AnyFunction>(fn?: T) {
  const fnRef = useRef<T>(wrap(fn));

  useEffect(() => {
    fnRef.current = wrap(fn);
  }, [fn]);

  return fnRef.current;
}
