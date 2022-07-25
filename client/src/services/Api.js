import axios from "axios"
import { get as getAccessToken } from "./Token";

axios.interceptors.request.use(function (config) {
    const accessToken = getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`
    return config;
});

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error?.response?.status === 403) {  window.location.href = "/" }
    if(error?.response?.status === 401) {  window.location.href = "/" }

    return Promise.reject(error);
});

export default axios;