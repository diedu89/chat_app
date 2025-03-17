import Cookies from "js-cookie";
import { handleUnauthorized } from "./auth";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

const BASE_URL = "http://localhost:3000/api/v1";

export const apiClient = {
  async fetch(endpoint: string, options: FetchOptions = {}) {
    const { skipAuth = false, headers = {}, ...rest } = options;

    const auth = JSON.parse(Cookies.get("auth") || "{}");
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(skipAuth ? {} : { Authorization: `Bearer ${auth.token}` }),
      ...headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: defaultHeaders,
      ...rest,
    });

    if (response.status === 401) {
      handleUnauthorized(response.status);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint: string, options?: FetchOptions) {
    return this.fetch(endpoint, { ...options, method: "GET" });
  },

  post(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.fetch(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
