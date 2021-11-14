import axios from "axios";

import { BASE_URL } from "config/env";

const request = axios.create({
  baseURL: `${BASE_URL}/api`,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

request.interceptors.response.use((response) => {
  return response.data;
});

export default request;
