/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __DEV__: boolean;

interface XhrResponse<T = any> {
  status: number;
  data: T;
}
