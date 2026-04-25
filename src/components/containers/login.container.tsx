import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login } from '#/api/auth/login.auth'
import { LoginForm } from '#/components/login-form'

export function LoginContainer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await login({ data })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Login failed')
      }

      return res.json()
    },

    onSuccess: async (data) => {
      queryClient.setQueryData(['user'], data)

      await queryClient.invalidateQueries({ queryKey: ['is-authenticated'] })

      await new Promise((resolve) => setTimeout(resolve, 100))

      navigate({ to: '/dashboard', replace: true })
    },

    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  return (
    <LoginForm
      onSubmit={mutation.mutateAsync}
      isLoading={mutation.isPending}
      error={mutation.error?.message}
    />
  )
}
