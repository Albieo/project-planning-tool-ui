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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Signup submitted:', value)
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
        <form>
          <FieldGroup>
            <Field>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField label="Full Name" placeholder="John Doe" />
                )}
              />
            </Field>
            <Field>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" placeholder="m@example.com" />
                )}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                  />
                )}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.TextField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                  />
                )}
              />
              <FieldDescription>
                Must match the password above.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <form.AppForm>
                  <form.SubscribeButton label="Create Account" />
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
