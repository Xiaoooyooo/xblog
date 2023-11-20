/* eslint-disable @typescript-eslint/no-explicit-any */

export type RequestOption = Omit<RequestInit, "url" | "body"> & {
  data?: string | Record<string, unknown>;
  search?: Record<string, string | number>;
};

// type Response<T = unknown> = {
//   code: number;
//   message: string;
//   data: T;
// };

export default class RequestHandler {
  private interceptors: [
    onFullfilled: (data: unknown) => unknown,
    onRejected?: (error: unknown) => unknown,
  ][] = [];
  private _requestWithFetch<T = unknown>(
    url: string,
    option: RequestOption = {},
    extraOption: Record<string, any>,
  ): Promise<T> {
    const { data, search, ...rest } = option;
    let body: BodyInit | null = null;
    if (typeof data === "string") {
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }
    let _url = url;
    if (search) {
      const s = new URLSearchParams();
      for (const key in search) {
        s.append(key, search[key] as string);
      }
      _url += `?${s.toString()}`;
    }
    return fetch(_url, { ...rest, body })
      .then(
        async (response) => {
          const isJson = /json/.test(
            response.headers.get("content-type") || "",
          );
          if (response.ok && isJson) {
            return response.json();
          }
          // ? not json
          if (isJson) throw await response.json();
          throw "request failed with status code " + response.status;
        },
        (networkError) => {
          __DEV__ && console.log("network error", networkError);
          throw { config: { url, option }, error: networkError, extraOption };
        },
      )
      .catch(async (error) => {
        __DEV__ && console.log("request error", error);
        throw { config: { url, option }, error, extraOption };
      });
  }

  async request<T>(
    url: string,
    options: RequestOption = {},
    extraOption: Record<string, any> = {},
  ) {
    const len = this.interceptors.length;
    let promise: Promise<unknown> = this._requestWithFetch<T>(
      url,
      options,
      extraOption,
    );
    for (let i = 0; i < len; i++) {
      const [onFullfilled, onRejected] = this.interceptors[i];
      promise = promise.then(onFullfilled, onRejected);
    }
    return promise as Promise<T>;
  }

  useInterceptor(
    onFullfilled: (data: any) => any,
    onRejected?: (error: any) => any,
  ) {
    this.interceptors.push([onFullfilled, onRejected]);
  }
}
