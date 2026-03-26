import axios, { AxiosRequestConfig } from "axios";
import { Platform, Share } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import axiosInstance, { setInterceptors } from "./axiosInstance";
import { getFromStore } from "../storage/device";
import { KeyConstants } from "../storage/constant";

const withInterceptors = async (callback: () => Promise<any>) => {
  await setInterceptors();
  return callback();
};

// Function to make a GET request with optional params and headers
export const getAPI = async <T>(
  endpoint: string,
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {},
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.get<T>(endpoint, {
        params,
        headers,
      });
      console.log(response, "ress");
      return response.data;
    } catch (error: any) {
      console.log(error, "error");
      throw new Error(
        error?.response?.data?.data?.details?.[0]?.message ||
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.response?.message,
      );
    }
  });
};

// Custom API Error class to include response data
export class APIError extends Error {
  data: any;
  constructor(message: string, data?: any) {
    super(message);
    this.name = "APIError";
    this.data = data;
  }
}

// Function to make a POST request with optional data and headers
export const postAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {},
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      console.log(data, "data");
      const response = await axiosInstance.post<T>(endpoint, data, {
        params,
        headers,
      });
      console.log(response, "response");
      return response.data;
    } catch (error: any) {
      console.log(error, "error");
      const errorMessage =
        error?.response?.data?.data?.message ||
        error?.response?.data?.data?.details?.[0]?.message ||
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.response?.data;
      const errorData = error?.response?.data?.data;
      throw new APIError(errorMessage, errorData);
    }
  });
};

// Function to make a PUT request with optional data and headers
export const putAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {},
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.put<T>(endpoint, data, {
        params,
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.data?.details?.[0]?.message ||
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.response?.message,
      );
    }
  });
};

// Function to make a DELETE request with optional data and headers
export const deleteAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {},
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.delete<T>(endpoint, {
        data,
        params,
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.data?.details?.[0]?.message ||
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.response?.message,
      );
    }
  });
};
