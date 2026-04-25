import { createServerFn } from '@tanstack/react-start'

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:4000'

export const isAuthenticated = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  try {
    const { request } = ctx as any
    
    let cookieHeader: string | null = null
    
    if (request?.headers) {
      const headers = request.headers
      cookieHeader = headers.get?.('cookie') || headers.cookie || headers['cookie']
    }

    if (!cookieHeader) return false

    const res = await fetch(`${BACKEND_URL}/auth/validate`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
    })

    return res.ok
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
})

export async function checkAuthClient(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/validate`, {
      method: 'GET',
      credentials: 'include',
    })

    return res.ok
  } catch (error) {
    console.error('Client auth check error:', error)
    return false
  }
}