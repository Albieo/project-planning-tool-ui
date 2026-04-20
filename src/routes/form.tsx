import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '#/hooks/form'

export const Route = createFileRoute('/form')({ component: FormUsePage })

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
})

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function FormUsePage() {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false as boolean,
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: wire up real auth when SSO is implemented
      console.log('Login submitted:', value)
      await new Promise((r) => setTimeout(r, 800))
      alert(`Welcome, ${value.email}! (stub — no real auth yet)`)
    },
  })

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#56c6be,#7ed3bf)] shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form — demonstrates useAppForm */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-5"
            noValidate
          >
            {/*
             * useAppForm field components:
             * form.AppField wires up the field context so that
             * the fieldComponent receives useFieldContext() automatically.
             */}
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField label="Email" placeholder="you@example.com" />
              )}
            />

            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                />
              )}
            />

            {/* Switch uses a boolean field */}
            <form.AppField
              name="rememberMe"
              children={(field) => <field.Switch label="Remember me" />}
            />

            {/*
             * SubscribeButton is a formComponent — it subscribes to
             * isSubmitting via useFormContext() and disables itself
             * while the form is submitting.
             */}
            <form.AppForm>
              <form.SubscribeButton label="Sign in" />
            </form.AppForm>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            SSO will be wired up in a later milestone.{' '}
            <span className="font-mono text-[var(--sea-ink)]">useAppForm</span>{' '}
            demo only.
          </p>
        </div>

        {/* Pattern callout */}
        <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm">
          <p className="mb-2 font-semibold text-[var(--sea-ink)]">
            How <code>useAppForm</code> works
          </p>
          <ol className="list-decimal pl-4 text-[var(--muted-foreground)] space-y-1">
            <li>
              <code>createFormHookContexts()</code> creates shared field/form
              contexts.
            </li>
            <li>
              <code>createFormHook()</code> binds field + form components to
              those contexts, producing <code>useAppForm</code>.
            </li>
            <li>
              <code>form.AppField</code> wraps each field and injects the field
              context so components like <code>TextField</code> and{' '}
              <code>Switch</code> don't need manual props.
            </li>
            <li>
              <code>form.AppForm</code> injects the form context so{' '}
              <code>SubscribeButton</code> can subscribe to{' '}
              <code>isSubmitting</code>.
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}
