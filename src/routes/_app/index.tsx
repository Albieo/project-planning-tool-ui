import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

function Home() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1>Project Planning Tool</h1>
    </main>
  )
}
