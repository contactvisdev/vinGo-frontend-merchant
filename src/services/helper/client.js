import axios from "axios";
import { isAuthenticated, logout } from "@/helpers/auth";
import constants from "@/helpers/constants/constants";

export const axiosInstance = axios.create({
  baseURL: constants.endPointUrl,
  timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = isAuthenticated();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  
  const apiUrl = import.meta.env.VITE__API_URL || "";
  const baseURL = config.baseURL || "";
  const fullUrl = config.url || "";
  const isNgrok = 
    apiUrl.includes('ngrok') || 
    baseURL.includes('ngrok') || 
    fullUrl.includes('ngrok') ||
    window.location.href.includes('ngrok');
  
  if (isNgrok) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error?.response?.status,
        url: error?.config?.url,
        message: error?.response?.data?.message || 'Unknown error',
      });
    }
    
    if (error?.response?.status === 401) {
      logout(() => {
        window.location.href = "/";
      });
    }
    return Promise.reject(error);
  }
);

const api = async (method, urlEndPoint, data = {}, params = {}, { signal } = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url: urlEndPoint,
      data,
      params,
      signal,
    });
    return response.data;
  } catch (error) {
    return error?.response ? error.response.data : error.toString();
  }
};

export default api;
