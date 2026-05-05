import { createFileRoute } from '@tanstack/react-router'
import { LoginContainer } from '#/components/containers/login.container'

export const Route = createFileRoute('/_auth/login/')({
  component: Login,
})

function Login() {
  return <LoginContainer />
}
