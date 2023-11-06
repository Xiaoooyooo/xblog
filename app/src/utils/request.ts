type RequestOptions = Omit<RequestInit, "url" | "body"> & {
  data?: string | Record<string, unknown>;
};

type Response<T = unknown> = {
  code: number;
  message: string;
  data: T;
};

class RequestHandler {
  private interceptors: [
    onFullfilled: (data: unknown) => unknown,
    onRejected?: (error: unknown) => unknown,
  ][] = [];
  /* mockjs 只重写了 xhr 对于 fetch 不起作用 */
  private _requestWithFetch<T = unknown>(
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { data, ...rest } = options;
    let body: BodyInit | null = null;
    if (typeof data === "string") {
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }
    return fetch(url, { ...rest, body })
      .then(
        (response) => {
          const isJson = /json/.test(
            response.headers.get("content-type") || "",
          );
          if (response.ok) {
            if (isJson) {
              return response.json();
            }
          }
          if (isJson) throw response.json();
          throw "request failed with status code " + response.status;
        },
        (networkError) => {
          console.log("network error", networkError);
          throw networkError;
        },
      )
      .catch((error) => {
        console.log("request error", error);
        throw error;
      });
  }

  private _requestWithXHR<T = unknown>(
    url: string,
    options: RequestOptions = {},
  ) {
    const { data, method = "get", headers } = options;
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      if (headers) {
        const _h = new Headers(headers);
        _h.forEach((value, key) => {
          xhr.setRequestHeader(key, value);
        });
      }
      let _data: XMLHttpRequestBodyInit | null = null;
      if (typeof data === "string") {
        _data = data;
      } else if (data) {
        _data = JSON.stringify(data);
      }

      xhr.onload = function () {
        let result;
        try {
          result = JSON.parse(this.response);
        } catch (err) {
          result = this.response;
        }
        if (this.status >= 200 && this.status < 300) {
          resolve(result);
        } else {
          reject(result);
        }
      };
      xhr.ontimeout = function (error) {
        reject(error);
      };
      xhr.onerror = function (error) {
        reject(error);
      };
      xhr.onabort = function (error) {
        reject(error);
      };

      xhr.send(_data);
    });
  }

  request<T>(url: string, options: RequestOptions = {}) {
    const len = this.interceptors.length;
    let promise: Promise<unknown> = this._requestWithXHR<T>(url, options);
    for (let i = 0; i < len; i++) {
      const [onFullfilled, onRejected] = this.interceptors[i];
      promise = promise.then(onFullfilled, onRejected);
    }
    return promise as Promise<T>;
  }

  useInterceptor(
    onFullfilled: (data: unknown) => unknown,
    onRejected?: (error: unknown) => unknown,
  ) {
    this.interceptors.push([onFullfilled, onRejected]);
  }
}

const requestHandler = new RequestHandler();

// eslint-disable-next-line
requestHandler.useInterceptor((response: any) => {
  if (response.code === 0) return response.data;
  throw response;
});

export default requestHandler.request.bind(requestHandler);
