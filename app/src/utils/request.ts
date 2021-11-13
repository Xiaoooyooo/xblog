import axios from "axios";

import { BASE_URL } from "config/env";

const request = axios.create({
  baseURL: BASE_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

export default request;
