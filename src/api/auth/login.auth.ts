import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { loginSchema } from '#/schemas/auth'
import { api, ensureLoggedOut, getLogoutPromise } from '#/api/http'
import type { LoginPayload } from '#/lib/interfaces/login-payload.interface'

async function loginRequest(data: LoginPayload) {
  // Wait for any active logout to finish before starting login.
  // Do not initiate a new logout if one is not already in progress.
  await getLogoutPromise()

  const parsed = loginSchema.parse(data)
  const res = await api.post('/auth/login', parsed)

  if (res.status !== 200) {
    throw new Error(res.data?.message || 'Login failed')
  }

  return res.data
}

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: () => {
      queryClient.setQueryData(['auth'], {
        authenticated: true,
      })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })

      navigate({ to: '/dashboard', replace: true })

      toast.success('Login successful', {
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
