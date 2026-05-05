import { useGetProfile } from '#/api/auth/get-profile.auth'
import { useUpdateProfile } from '#/api/auth/update-profile.auth'
import { ProfileForm } from '#/components/profile/ProfileForm'

export function ProfileContainer() {
  const { data: profile } = useGetProfile()
  const mutation = useUpdateProfile()

  const handleSubmit = async (data: {
    name: string
    username: string
    email: string
    avatar: File | null
  }) => {
    await mutation.mutateAsync(data)
  }

  return profile ? (
    <ProfileForm
      profile={profile}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  ) : null
}
