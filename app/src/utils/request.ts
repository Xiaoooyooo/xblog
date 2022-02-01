import axios from "axios";

const request = axios.create({
  baseURL: `/api`,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

request.interceptors.response.use((response) => {
  return response.data;
});

export default request;
