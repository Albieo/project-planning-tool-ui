import { createFileRoute } from '@tanstack/react-router'
import { profileQuery } from '#/api/auth/get-profile.auth'
import { ProfileContainer } from '#/components/containers/profile.container'

export const Route = createFileRoute('/_app/_authenticated/profile/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(profileQuery())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <ProfileContainer />
    </div>
  )
}
