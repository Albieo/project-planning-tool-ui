import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '#/api/http'
import type { ProfileResponse } from '#/lib/interfaces/profile-response.interface'
import type { UpdateProfilePayload } from '#/lib/interfaces/update-profile-payload.interface'

async function updateProfileRequest(data: UpdateProfilePayload) {
  const profileRes = await api.patch<ProfileResponse>('/auth/profile', {
    name: data.name,
    username: data.username,
  })

  if (profileRes.status === 409)
    throw new Error('That username is already taken')

  if (profileRes.status >= 400) throw new Error('Failed to update profile')

  let nextProfile = profileRes.data

  if (data.avatar) {
    const formData = new FormData()
    formData.append('file', data.avatar)

    const uploadRes = await api.post<{
      url: string
      message: string
    }>('/auth/upload-profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (uploadRes.status >= 400) {
      const uploadError = uploadRes.data as {
        error?: string
        message?: string
      }

      throw new Error(
        uploadError.message ||
          uploadError.error ||
          'Failed to upload profile photo',
      )
    }

    nextProfile = {
      ...nextProfile,
      profilePhotoUrl: uploadRes.data.url,
    }
  }

  return nextProfile
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (profile) => {
      queryClient.setQueryData(['auth', 'profile'], profile)
      toast.success('Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
