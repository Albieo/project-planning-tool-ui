import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '#/components/Header'
import Footer from '#/components/Footer'
import { authQuery } from '#/api/auth/isAuthenticated'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    // Ensure auth state is seeded before Header renders — eliminates the
    // isLoading flash that hides Login/Register on first paint.
    await queryClient.ensureQueryData(authQuery())
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
