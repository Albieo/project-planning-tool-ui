import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordContainer } from '#/components/containers/reset-password.container'
import { resetPasswordSearchSchema } from '#/schemas/auth'

export const Route = createFileRoute('/_auth/reset-password/')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPassword,
})

/**
 * Renders the password reset form using the token from the route search parameters.
 */
function ResetPassword() {
  const { token } = Route.useSearch()

  return <ResetPasswordContainer token={token} />
}
