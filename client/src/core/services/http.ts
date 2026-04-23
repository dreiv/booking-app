const BASE_URL = import.meta.env.VITE_API_URL || ''

interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | string[] | number[] | undefined>
}

async function request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...fetchOptions } = options

  let queryString = ''
  if (params) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)))
      } else {
        searchParams.set(key, String(value))
      }
    })

    const qs = searchParams.toString()
    queryString = qs ? `?${qs}` : ''
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  })

  const response = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  if (response.status === 204) return {} as T
  return response.json()
}

export const http = {
  get: <T>(url: string, params?: HttpOptions['params'], options?: Omit<HttpOptions, 'params'>) =>
    request<T>(url, { ...options, method: 'GET', params }),

  post: <T>(url: string, data?: unknown, options?: HttpOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
}
