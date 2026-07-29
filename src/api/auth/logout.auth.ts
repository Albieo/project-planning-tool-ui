import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { api } from '#/api/http'

async function logoutRequest() {
  const res = await api.post('/auth/logout')

  if (res.status >= 400) {
    throw new Error('Failed to log out')
  }

  return res.data
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['auth'] })
      queryClient.setQueryData(['auth'], { authenticated: false })
      queryClient.removeQueries({ queryKey: ['auth', 'profile'], exact: true })
      await router.invalidate()

      toast.success('Logged out successfully')
      await navigate({ to: '/login', replace: true })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
