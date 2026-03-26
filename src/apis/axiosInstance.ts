import axios from "axios";
import { getFromStore, setStore } from "../storage/device";
import { KeyConstants } from "../storage/constant";

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "http://192.168.29.187:3000", // for debugging in android device via wifi
});

axios.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

// Response interceptor
axios.interceptors.response.use((response) => {
  console.log("Response:", response);
  return response;
});

let cachedToken: any = null;
let cachedRefreshToken: any = null;
let cachedDeviceId: any = null;

export const setInterceptors = async () => {
  cachedToken = await getFromStore(KeyConstants.ACCESS_TOKEN);
  cachedRefreshToken = await getFromStore(KeyConstants.REFRESH_TOKEN);
  cachedDeviceId = await getFromStore(KeyConstants.DEVICE_ID);

  axiosInstance.interceptors.request.use(
    (config) => {
      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      }
      if (cachedRefreshToken) {
        config.headers.refreshToken = cachedRefreshToken;
      }
      if (cachedDeviceId) {
        config.headers.deviceId = cachedDeviceId;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
};

export const updateToken = async (newToken: any) => {
  cachedToken = newToken;
  await setStore({ key: KeyConstants.ACCESS_TOKEN, value: newToken });
  axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
};

export default axiosInstance;
