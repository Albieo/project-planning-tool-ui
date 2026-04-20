import { SignupForm } from '#/components/signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register/')({
  component: Register,
})

function Register() {
  return <SignupForm className="w-full max-w-sm" />
}
