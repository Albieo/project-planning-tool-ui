import * as Sentry from '@sentry/tanstackstart-react'
import { getRequest } from '@tanstack/react-start/server'
import { api } from '#/api/http'

async function getAuthStateServerRequest() {
  return Sentry.startSpan(
    {
      name: 'server.auth.getAuthState',
      op: 'server.auth.getAuthState',
      description: 'Server-side auth state lookup',
    },
    async () => {
      try {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie')

        if (!cookieHeader) {
          return { authenticated: false }
        }

        const res = await api.get('/auth/validate', {
          headers: { Cookie: cookieHeader },
          withCredentials: false,
        })

        return {
          authenticated: res.status >= 200 && res.status < 300,
        }
      } catch {
        return { authenticated: false }
      }
    },
  )
}

async function getAuthStateClientRequest() {
  try {
    const res = await api.get('/auth/validate', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })

    return {
      authenticated: res.status >= 200 && res.status < 300,
    }
  } catch {
    return { authenticated: false }
  }
}

export const authQuery = () => ({
  queryKey: ['auth'],
  queryFn: () =>
    typeof window === 'undefined'
      ? getAuthStateServerRequest()
      : getAuthStateClientRequest(),
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})
