/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __DEV__: boolean;

/** client runtime environment */
declare const ENV: {
  /** 国内备案号, defined in .env */
  __BEIAN__: string;
};

interface XhrResponse<T = any> {
  status: number;
  data: T;
}
