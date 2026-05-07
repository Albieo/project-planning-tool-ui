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

export function resolveBackendUrl(path?: string | null) {
  if (!path) return undefined
  if (/^(blob:|data:|https?:\/\/)/i.test(path)) return path

  return new URL(path, BACKEND_URL).toString()
}

api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/logout') && response.status === 200) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    return Promise.reject(error)
  },
)
