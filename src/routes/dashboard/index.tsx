import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '#/api/auth/isAuthenticated'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    const result = await isAuthenticated()

    // Handle both boolean and object responses
    const authenticated =
      typeof result === 'boolean' ? result : result.authenticated

    if (!authenticated) {
      throw redirect({ to: '/login' })
    }

    // If using enhanced version, you can return user data
    return typeof result === 'object'
      ? result
      : { authenticated: true, user: null }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/"!</div>
}
