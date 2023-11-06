export function response<T = unknown>(data: T) {
  return {
    code: 0,
    message: "OK",
    data,
  };
}
