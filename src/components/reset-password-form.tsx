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
import { forgotPasswordSchema, resetPasswordSchema } from '#/schemas/auth'

type ResetPasswordFormProps = {
  token?: string
  onRequestReset: (data: { email: string }) => Promise<void>
  onResetPassword: (data: {
    token: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function ResetPasswordForm({
  token,
  onRequestReset,
  onResetPassword,
  isLoading,
  error,
}: Readonly<ResetPasswordFormProps>) {
  const hasToken = Boolean(token)

  const requestForm = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await onRequestReset(value)
    },
  })

  const resetForm = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) return
      await onResetPassword({ token, ...value })
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {hasToken ? 'Reset your password' : 'Forgot your password?'}
        </CardTitle>
        <CardDescription>
          {hasToken
            ? 'Enter a new password for your account'
            : 'Enter your email and we will send you a reset link'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {hasToken ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              resetForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <Field>
                <resetForm.AppField name="password">
                  {(field) => (
                    <field.TextField
                      label="New password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  )}
                </resetForm.AppField>
              </Field>

              <Field>
                <resetForm.AppField name="confirmPassword">
                  {(field) => (
                    <field.TextField
                      label="Confirm password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  )}
                </resetForm.AppField>
              </Field>

              <Field>
                <resetForm.AppForm>
                  <resetForm.SubscribeButton
                    label={isLoading ? 'Resetting...' : 'Reset password'}
                  />
                </resetForm.AppForm>
                {error && (
                  <FieldDescription className="text-center">
                    {error}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              requestForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <Field>
                <requestForm.AppField name="email">
                  {(field) => (
                    <field.TextField
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="m@example.com"
                    />
                  )}
                </requestForm.AppField>
              </Field>

              <Field>
                <requestForm.AppForm>
                  <requestForm.SubscribeButton
                    label={isLoading ? 'Sending...' : 'Send reset link'}
                  />
                </requestForm.AppForm>
                {error && (
                  <FieldDescription className="text-center">
                    {error}
                  </FieldDescription>
                )}
                <FieldDescription className="text-center">
                  Remember your password? <Link to="/login">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
