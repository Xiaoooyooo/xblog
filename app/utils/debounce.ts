/* eslint-disable @typescript-eslint/no-explicit-any */
export default function debounce<T extends (...args: any[]) => any>(
  fn: T,
  timeout: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(() => {
      fn.call(this, args);
    }, timeout);
  } as T;
}
