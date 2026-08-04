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

// Shared single-flight logout promise to prevent duplicate logout requests
// and coordinate with login/authentication transitions
let logoutPromise: Promise<void> | null = null

/**
 * Ensures only one logout request is in flight at a time.
 * Concurrent callers receive the same promise.
 *
 * This is useful when multiple authentication flows may trigger
 * a logout simultaneously (e.g. expired tokens or session cleanup).
 */
export function ensureLoggedOut(): Promise<void> {
  if (logoutPromise) {
    return logoutPromise
  }

  logoutPromise = api
    .post('/auth/logout')
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      logoutPromise = null
    })

  return logoutPromise
}

// When the backend returns 401, attempt to clear server-side credentials by
// calling the logout endpoint. Protect against recursion by skipping the
// interceptor when the request is itself the logout call.
api.interceptors.response.use(
  (response) => {
    // If unauthorized and it's not the logout request, try to clear credentials
    try {
      const reqUrl = response.config.url || ''

      // Normalize URL to check if this is the logout endpoint itself
      let pathname = ''
      try {
        const url = new URL(reqUrl, BACKEND_URL)
        pathname = url.pathname
      } catch {
        // If URL parsing fails, treat reqUrl as a pathname
        pathname = reqUrl
      }

      // Only trigger logout if this is a 401 and NOT the logout endpoint itself
      if (response.status === 401 && pathname !== '/auth/logout') {
        // Use shared single-flight logout to avoid duplicate requests
        void ensureLoggedOut()
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
