import { createFileRoute } from '@tanstack/react-router'
import { RegisterContainer } from '#/components/containers/register.container'

export const Route = createFileRoute('/_auth/register/')({
  component: Register,
})

function Register() {
  return <RegisterContainer />
}
