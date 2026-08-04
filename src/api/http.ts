import axios from 'axios'

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  'http://localhost:4000'

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
  validateStatus: () => true,
})

/**
 * Resolves a resource path against the configured backend URL.
 *
 * @param path - The resource path or absolute URL to resolve
 * @returns The resolved URL, the original `blob:`, `data:`, or HTTP(S) URL, or `undefined` for an empty, protocol-relative, or invalid path
 */
export function resolveBackendUrl(path?: string | null) {
  if (!path) return undefined
  if (/^(blob:|data:|https?:\/\/)/i.test(path)) return path
  if (path.startsWith('//')) return undefined

  try {
    return new URL(path, BACKEND_URL).toString()
  } catch {
    return undefined
  }
}

// When the backend returns 401, attempt to clear server-side credentials by
// calling the logout endpoint. Protect against recursion by skipping the
// interceptor when the request is itself the logout call.
api.interceptors.response.use(
  (response) => {
    // If unauthorized and it's not the logout request, try to clear credentials
    try {
      const reqUrl = response.config.url || ''
      if (response.status === 401 && !/\/auth\/logout/.test(reqUrl)) {
        // Fire-and-forget logout to clear HttpOnly cookies server-side.
        // We ignore errors here to avoid breaking the original response flow.
        void api.post('/auth/logout').catch(() => {})
      }
    } catch {
      // swallow any errors here
    }

    return response
  },
  (error) => {
    // Network or other errors - propagate as-is
    return Promise.reject(error)
  },
)
