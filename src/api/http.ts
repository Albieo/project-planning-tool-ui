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
  if (/^\/\//.test(path)) return undefined

  try {
    return new URL(path, BACKEND_URL).toString()
  } catch {
    return undefined
  }
}
