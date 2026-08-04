import { useGetProfile } from '#/api/auth/get-profile.auth'
import { useUpdateProfile } from '#/api/auth/update-profile.auth'
import { ProfileForm } from '#/components/profile/ProfileForm'
import type { UpdateProfilePayload } from '#/lib/interfaces/update-profile-payload.interface'

/**
 * Renders the profile form when the user's profile is available.
 *
 * @returns The profile form or `null` when the profile is unavailable.
 */
export function ProfileContainer() {
  const { data: profile } = useGetProfile()
  const mutation = useUpdateProfile()

  const handleSubmit = async (data: UpdateProfilePayload) => {
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
