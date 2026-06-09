import axios from "axios";
import i18n from "i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach token + language to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = i18n.language?.slice(0, 2) ?? "en";
  return config;
});

// If 401 → token expired or invalid → clear session
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      i18n.t("errors.unexpected")
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error ?? i18n.t("errors.unexpected"));
}

export default api;
