import { redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/api/auth/isAuthenticated'

export async function requireAuth() {
  const ok = await isAuthenticated()

  if (!ok) {
    throw redirect({
      to: '/login',
      search: {
        redirect: '/dashboard',
      },
    })
  }
}
