const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

interface HttpOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(
  endpoint: string,
  options: HttpOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, ...fetchOptions } = options;

  const queryString = params ? `?${new URLSearchParams(params)}` : "";
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  });

  const response = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const http = {
  get: <T>(
    url: string,
    params?: Record<string, string>,
    options?: HttpOptions,
  ) => request<T>(url, { ...options, method: "GET", params }),

  post: <T>(url: string, data?: unknown, options?: HttpOptions) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(data) }),
};
