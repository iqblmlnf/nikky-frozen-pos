import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? "http://localhost:8000";

export const API_BASE_URL = `${API_ORIGIN}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export function storageUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_ORIGIN}/storage/${path}`;
}