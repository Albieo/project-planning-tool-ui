import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Welcome back. This is your workspace overview.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage your active projects.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Track your pending tasks.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Activity</h2>
          <p className="text-sm text-muted-foreground">
            Recent updates and changes.
          </p>
        </div>
      </section>
    </main>
  )
}
