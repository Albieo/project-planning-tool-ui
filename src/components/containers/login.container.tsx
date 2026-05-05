import { LoginForm } from '#/components/login-form'
import { useLogin } from '#/api/auth/login.auth'

export function LoginContainer() {
  const mutation = useLogin()

  const handleSubmit = async (data: { email: string; password: string }) => {
    await mutation.mutateAsync(data)
  }

  return <LoginForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
}
