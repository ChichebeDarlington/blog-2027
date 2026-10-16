/// <reference types="vite/client" />

import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",

  baseURL: import.meta.env.DEV
    ? "http://localhost:5000/api/v1"
    : import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error))
    return error.response?.data?.error?.message || error.message || fallback;
  if (error instanceof Error) return error.message;
  return fallback;
};
