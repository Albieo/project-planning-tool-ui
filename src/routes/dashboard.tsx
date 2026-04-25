import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '#/api/auth/isAuthenticated'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const result = await isAuthenticated()

    const authenticated =
      typeof result === 'boolean' ? result : (result as { authenticated: boolean }).authenticated

    if (!authenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </main>
  )
}
