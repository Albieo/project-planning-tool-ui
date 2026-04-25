import { createServerFn } from '@tanstack/react-start'
import { loginSchema } from '#/schemas/auth'

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:4000'

export const login = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const data = loginSchema.parse(ctx.data)

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    if (res.status === 401) {
      return new Response('Invalid email or password', { status: 401 })
    }
    const message = await res.text()
    return new Response(message || 'Login failed', { status: res.status })
  }

  const { accessToken, email, role } = await res.json()

  const isProd = import.meta.env.NODE_ENV === 'production'
  const cookieOptions = [
    `token=${accessToken}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    isProd ? 'Secure' : '',
    'Max-Age=86400',
  ].filter(Boolean).join('; ')

  return new Response(JSON.stringify({ email, role }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieOptions,
    },
  })
})
