import store from "@/redux";
import { setUserInfo } from "@/redux/actions/user";
import RequestHandler, { RequestOption } from "@/utils/request";

const requestHandler = new RequestHandler();

type RefreshTokenResponse = {
  token: string;
};

type RequestError = {
  config: { url: string; option: RequestOption };
  // eslint-disable-next-line
  error: any;
  // eslint-disable-next-line
  extraOption: Record<string, any>;
};

requestHandler.useInterceptor(
  // eslint-disable-next-line
  (response: any) => {
    if (response.code === 0) return response.data;
    throw response;
  },
  async (err: RequestError) => {
    const { config, error, extraOption } = err;
    if (
      typeof err !== "string" &&
      "status" in error &&
      error.status === 401 &&
      !extraOption.refreshToken
    ) {
      return request<RefreshTokenResponse>(
        "/api/auth/refresh",
        {
          method: "post",
        },
        // mark this request as a refresh token request
        { refreshToken: true },
      ).then(({ token }) => {
        store.dispatch(setUserInfo({ token }));
        return request(config.url, {
          ...config.option,
          headers: {
            ...config.option.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      });
    } else if (extraOption.refreshToken) {
      location.href = "/";
    }
    throw err;
  },
);

const request: typeof requestHandler.request = (...args) =>
  requestHandler.request(...args);

export default request;
