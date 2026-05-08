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
import { loginSchema } from '#/schemas/auth'

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function LoginForm({
  onSubmit,
  error,
  isLoading,
}: Readonly<LoginFormProps>) {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                  />
                )}
              </form.AppField>
            </Field>

            <Field>
              <form.AppField name="password">
                {(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    forgotPassword={
                      <Link
                        to="/reset-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    }
                  />
                )}
              </form.AppField>
            </Field>

            <Field>
              <form.AppForm>
                <form.SubscribeButton
                  label={isLoading ? 'Logging in...' : 'Login'}
                />
              </form.AppForm>

              {error && (
                <FieldDescription className="text-center">
                  {error}
                </FieldDescription>
              )}

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/register">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
