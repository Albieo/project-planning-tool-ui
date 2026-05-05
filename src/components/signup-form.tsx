import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '#/components/ui/field'
import { useAppForm } from '#/hooks/form'
import { registerSchema } from '#/schemas/auth'
import type { ComponentProps } from 'react'

type SignupFormProps = ComponentProps<typeof Card> & {
  onSubmitData: (data: {
    name: string
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function SignupForm({
  onSubmitData,
  isLoading,
  error,
  ...props
}: SignupFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmitData(value)
    },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <Field>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label="Full Name"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                )}
              </form.AppField>
            </Field>
            <Field>
              <form.AppField name="username">
                {(field) => (
                  <field.TextField
                    label="Username"
                    placeholder="Johndoe12"
                    autoComplete="username"
                  />
                )}
              </form.AppField>
            </Field>
            <Field>
              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                  />
                )}
              </form.AppField>
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <form.AppField name="password">
                {(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              </form.AppField>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <form.AppField name="confirmPassword">
                {(field) => (
                  <field.TextField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              </form.AppField>
              <FieldDescription>
                Must match the password above.
              </FieldDescription>
            </Field>

            {error && (
              <FieldDescription className="text-center text-red-500 font-medium">
                {error}
              </FieldDescription>
            )}

            <FieldGroup>
              <Field>
                <form.AppForm>
                  <form.SubscribeButton
                    label={isLoading ? 'Creating Account...' : 'Create Account'}
                  />
                </form.AppForm>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
