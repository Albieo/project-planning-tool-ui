import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

/**
 * Renders the PlanMesh home page.
 */
function Home() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1>PlanMesh</h1>
    </main>
  )
}
