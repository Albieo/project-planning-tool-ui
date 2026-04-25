import { createServerFn } from '@tanstack/react-start'
import { registerSchema } from '#/schemas/auth'

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:4000'

export const register = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const data = registerSchema.parse(ctx.data)

  const backendData = {
    email: data.email,
    password: data.password,
  }

  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendData),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return new Response('User with this email already exists', { status: 409 })
    }
    if (res.status === 400) {
      const message = await res.text()
      return new Response(message || 'Invalid registration data', { status: 400 })
    }
    const message = await res.text()
    return new Response(message || 'Registration failed', { status: res.status })
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