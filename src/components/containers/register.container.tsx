// /components/containers/register.container.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { register } from '#/api/auth/register.auth'
import { SignupForm } from '#/components/signup-form'

export function RegisterContainer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { 
      name: string
      email: string
      password: string
      confirmPassword: string 
    }) => {
      const res = await register({ data })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Registration failed')
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
      console.error('Registration failed:', error)
    },
  })

  return (
    <SignupForm
      onSubmit={(data) => mutation.mutateAsync(data)}
      isLoading={mutation.isPending}
      error={mutation.error?.message}
    />
  )
}