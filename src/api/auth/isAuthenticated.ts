import { createServerFn } from '@tanstack/react-start'
import { api } from '#/api/http'

const isAuthenticatedServer = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  try {
    const { request } = ctx as { request: Request }
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
})

async function getClientAuthState() {
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
      ? isAuthenticatedServer()
      : getClientAuthState(),
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})
