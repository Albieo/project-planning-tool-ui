import { buttonVariants } from '#/components/ui/button'
import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { authQuery } from '#/api/auth/isAuthenticated'
import { searchSchema } from '#/schemas/auth'

export const Route = createFileRoute('/_auth')({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    const { queryClient } = context

    const { authenticated } = await queryClient.ensureQueryData(authQuery())

    if (authenticated) {
      throw redirect({
        to: search.redirect || '/dashboard',
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-8 left-8">
        <Link to="/" className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
