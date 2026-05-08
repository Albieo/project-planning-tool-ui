import {
  useRequestPasswordReset,
  useResetPassword,
} from '#/api/auth/reset-password.auth'
import { ResetPasswordForm } from '#/components/reset-password-form'

export function ResetPasswordContainer({ token }: Readonly<{ token?: string }>) {
  const requestMutation = useRequestPasswordReset()
  const resetMutation = useResetPassword()
  const activeMutation = token ? resetMutation : requestMutation

  return (
    <ResetPasswordForm
      token={token}
      onRequestReset={(data) => requestMutation.mutateAsync(data)}
      onResetPassword={(data) => resetMutation.mutateAsync(data)}
      isLoading={activeMutation.isPending}
      error={activeMutation.error?.message}
    />
  )
}
