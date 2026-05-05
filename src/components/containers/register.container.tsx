import { useRegister } from '#/api/auth/register.auth'
import { SignupForm } from '#/components/signup-form'

export function RegisterContainer() {
  const mutation = useRegister()

  const handleSubmit = async (data: {
    name: string
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    await mutation.mutateAsync(data)
  }

  return (
    <SignupForm
      onSubmitData={handleSubmit}
      isLoading={mutation.isPending}
      error={mutation.error?.message}
      className="w-full max-w-sm"
    />
  )
}
