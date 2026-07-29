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
