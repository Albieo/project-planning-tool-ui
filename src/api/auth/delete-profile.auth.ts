import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { api } from '#/api/http'

async function deleteProfileRequest() {
  const res = await api.delete('/auth/profile', {
    withCredentials: true,
  })

  if (res.status >= 400) {
    throw new Error('Failed to delete profile')
  }

  return res.data
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteProfileRequest,
    onSuccess: async () => {
      queryClient.setQueryData(['auth'], { authenticated: false })
      queryClient.removeQueries({ queryKey: ['auth', 'profile'] })
      toast.success('Profile deleted successfully')
      navigate({ to: '/login', replace: true })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
