import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authQuery } from '#/api/auth/isAuthenticated'

export const Route = createFileRoute('/_app/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { queryClient } = context

    const { authenticated } = await queryClient.ensureQueryData(authQuery())

    if (!authenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },

  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
