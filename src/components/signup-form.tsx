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
  onSubmit: (data: { 
    name: string
    email: string
    password: string
    confirmPassword: string 
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function SignupForm({ 
  onSubmit, 
  isLoading, 
  error,
  ...props 
}: SignupFormProps) {
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
      await onSubmit(value)
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
                  <field.TextField 
                    label="Email" 
                    type="email"
                    placeholder="m@example.com" 
                  />
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                  />
                )}
              />
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