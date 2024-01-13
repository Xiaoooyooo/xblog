/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __DEV__: boolean;
/** 国内备案号, defined in .env */
declare const __BEIAN__: string;

interface XhrResponse<T = any> {
  status: number;
  data: T;
}
