import { registerSchema } from '#/schemas/auth'
import { api } from '#/api/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { RegisterPayload } from '#/lib/interfaces/register-payload.interface'

async function registerRequest(data: RegisterPayload) {
  const parsed = registerSchema.parse(data)
  const backendData = {
    name: parsed.name,
    username: parsed.username,
    email: parsed.email,
    password: parsed.password,
  }

  const res = await api.post('/auth/register', backendData)

  if (res.status === 409) {
    throw new Error('User with this email or username already exists')
  }

  if (res.status !== 200) {
    const message =
      typeof res.data === 'string'
        ? res.data
        : res.data?.message || 'Invalid registration data'

    throw new Error(message)
  }

  return res.data
}

export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerRequest,

    onSuccess: () => {
      queryClient.setQueryData(['auth'], {
        authenticated: true,
      })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })

      navigate({ to: '/dashboard', replace: true })

      toast.success('Registration successful', {
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
