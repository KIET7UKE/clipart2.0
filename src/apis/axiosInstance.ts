import axios from 'axios';
import { getFromStore, setStore } from '../storage/device';
import { KeyConstants } from '../storage/constant';

import { showToast } from '../utils/toastBridge';

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  // baseURL: "http://192.168.29.187:3000", // for debugging in android device via wifi
  baseURL: 'https://clipart2-0.vercel.app', // for debugging in android device via wifi
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    let errorMessage = 'Something went wrong';

    if (error.response) {
      // Server responded with an error (4xx, 5xx)
      errorMessage =
        error.response.data?.message ||
        error.response.data?.data?.message ||
        error.response.data?.error ||
        `Error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error: Please check your internet connection';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    // Show top-level toast
    showToast(errorMessage, 'error');

    return Promise.reject(error);
  },
);

let cachedToken: any = null;
let cachedRefreshToken: any = null;
let cachedDeviceId: any = null;

export const setInterceptors = async () => {
  cachedToken = await getFromStore(KeyConstants.ACCESS_TOKEN);
  cachedRefreshToken = await getFromStore(KeyConstants.REFRESH_TOKEN);
  cachedDeviceId = await getFromStore(KeyConstants.DEVICE_ID);

  axiosInstance.interceptors.request.use(
    config => {
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
    error => Promise.reject(error),
  );
};

export const updateToken = async (newToken: any) => {
  cachedToken = newToken;
  await setStore({ key: KeyConstants.ACCESS_TOKEN, value: newToken });
  axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
};

export default axiosInstance;
