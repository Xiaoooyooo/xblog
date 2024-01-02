import store from "@/redux";
import { setUserInfo } from "@/redux/actions/user";
import RequestHandler, { RequestOption, ExtraOption } from "@/utils/request";

const requestHandler = new RequestHandler();

type RefreshTokenResponse = {
  token: string;
};

type RequestError = {
  config: { url: string; option: RequestOption };
  // eslint-disable-next-line
  error: any;
  // eslint-disable-next-line
  extraOption: ExtraOption;
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
      !extraOption.noRefresh
    ) {
      return request<RefreshTokenResponse>(
        "/api/auth/refresh",
        {
          method: "post",
        },
        // skip another refresh request for this request
        { noRefresh: true },
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
    }
    throw err;
  },
);

const request: typeof requestHandler.request = (...args) =>
  requestHandler.request(...args);

export default request;
