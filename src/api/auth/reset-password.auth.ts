import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { api } from '#/api/http'
import { forgotPasswordSchema, resetPasswordSchema } from '#/schemas/auth'

async function requestPasswordReset(data: { email: string }) {
  const parsed = forgotPasswordSchema.parse(data)
  const res = await api.post('/auth/forgot-password', parsed)

  if (res.status !== 202) {
    throw new Error(res.data?.message || 'Could not request password reset')
  }
}

async function resetPassword(data: {
  token: string
  password: string
  confirmPassword: string
}) {
  const parsed = resetPasswordSchema.parse(data)
  const res = await api.post('/auth/reset-password', {
    token: data.token,
    password: parsed.password,
  })

  if (res.status !== 200) {
    throw new Error(res.data?.message || 'Invalid or expired reset link')
  }
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset email sent', {
        position: 'bottom-right',
      })
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'bottom-right',
      })
    },
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful', {
        position: 'bottom-right',
      })

      navigate({ to: '/login', replace: true })
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'bottom-right',
      })
    },
  })
}
