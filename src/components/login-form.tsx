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

export function LoginForm() {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Login submitted:', value)
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
        <form>
          <FieldGroup>
            <Field>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    type="email"
                    placeholder="m@example.com"
                  />
                )}
              />
            </Field>
            <Field>
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    forgotPassword={
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    }
                  />
                )}
              />
            </Field>
            <Field>
              <form.AppForm>
                <form.SubscribeButton label="Login" />
              </form.AppForm>
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
