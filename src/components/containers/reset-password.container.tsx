import {
  useRequestPasswordReset,
  useResetPassword,
} from '#/api/auth/reset-password.auth'
import { ResetPasswordForm } from '#/components/reset-password-form'

/**
 * Renders the password reset form with the appropriate mutation state and handlers.
 *
 * @param token - Optional token used to complete a password reset.
 */
export function ResetPasswordContainer({
  token,
}: Readonly<{ token?: string }>) {
  const requestMutation = useRequestPasswordReset()
  const resetMutation = useResetPassword()
  const activeMutation = token ? resetMutation : requestMutation

  return (
    <ResetPasswordForm
      token={token}
      onRequestReset={(data) =>
        requestMutation.mutateAsync(data).catch(() => {})
      }
      onResetPassword={(data) =>
        resetMutation.mutateAsync(data).catch(() => {})
      }
      isLoading={activeMutation.isPending}
      error={activeMutation.error?.message}
    />
  )
}
