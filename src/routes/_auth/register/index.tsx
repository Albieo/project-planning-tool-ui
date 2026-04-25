import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginContainer } from '#/components/containers/login.container'
import { isAuthenticated } from '#/api/auth/isAuthenticated'

export const Route = createFileRoute('/_auth/register/')({
  component: Register,
  beforeLoad: async () => {
    try {
      const result = await isAuthenticated()

      if (result) throw redirect({ to: '/dashboard' })

    } catch (error) {
      console.error('💥 Error in beforeLoad:', error)
    }
  },
})

function Register() {
  return <LoginContainer />
}
