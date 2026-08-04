// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { ResetPasswordForm } from '#/components/reset-password-form'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('ResetPasswordForm without a token', () => {
  it('renders the request-reset view', () => {
    render(
      <ResetPasswordForm onRequestReset={vi.fn()} onResetPassword={vi.fn()} />,
    )

    expect(screen.getByText('Forgot your password?')).not.toBeNull()
    expect(screen.getByLabelText('Email')).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Send reset link' }),
    ).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Log in' })).not.toBeNull()
  })

  it('calls onRequestReset with the entered email', async () => {
    const onRequestReset = vi.fn().mockResolvedValue(undefined)
    render(
      <ResetPasswordForm
        onRequestReset={onRequestReset}
        onResetPassword={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() => {
      expect(onRequestReset).toHaveBeenCalledWith({
        email: 'user@example.com',
      })
    })
  })

  it('does not call onRequestReset for an invalid email', async () => {
    const onRequestReset = vi.fn()
    render(
      <ResetPasswordForm
        onRequestReset={onRequestReset}
        onResetPassword={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'not-an-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(onRequestReset).not.toHaveBeenCalled()
  })

  it('shows the loading label on the submit button', () => {
    render(
      <ResetPasswordForm
        onRequestReset={vi.fn()}
        onResetPassword={vi.fn()}
        isLoading
      />,
    )

    expect(screen.getByRole('button', { name: 'Sending...' })).not.toBeNull()
  })

  it('displays the provided error message', () => {
    render(
      <ResetPasswordForm
        onRequestReset={vi.fn()}
        onResetPassword={vi.fn()}
        error="Something went wrong"
      />,
    )

    expect(screen.getByText('Something went wrong')).not.toBeNull()
  })
})

describe('ResetPasswordForm with a token', () => {
  it('renders the reset-password view', () => {
    render(
      <ResetPasswordForm
        token="reset-token"
        onRequestReset={vi.fn()}
        onResetPassword={vi.fn()}
      />,
    )

    expect(screen.getByText('Reset your password')).not.toBeNull()
    expect(screen.getByLabelText('New password')).not.toBeNull()
    expect(screen.getByLabelText('Confirm password')).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Reset password' }),
    ).not.toBeNull()
  })

  it('calls onResetPassword with the token and matching passwords', async () => {
    const onResetPassword = vi.fn().mockResolvedValue(undefined)
    render(
      <ResetPasswordForm
        token="reset-token"
        onRequestReset={vi.fn()}
        onResetPassword={onResetPassword}
      />,
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(onResetPassword).toHaveBeenCalledWith({
        token: 'reset-token',
        password: 'password123',
        confirmPassword: 'password123',
      })
    })
  })

  it('does not call onResetPassword when the passwords do not match', async () => {
    const onResetPassword = vi.fn()
    render(
      <ResetPasswordForm
        token="reset-token"
        onRequestReset={vi.fn()}
        onResetPassword={onResetPassword}
      />,
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'different456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(onResetPassword).not.toHaveBeenCalled()
  })

  it('shows the loading label on the submit button', () => {
    render(
      <ResetPasswordForm
        token="reset-token"
        onRequestReset={vi.fn()}
        onResetPassword={vi.fn()}
        isLoading
      />,
    )

    expect(screen.getByRole('button', { name: 'Resetting...' })).not.toBeNull()
  })

  it('displays the provided error message', () => {
    render(
      <ResetPasswordForm
        token="reset-token"
        onRequestReset={vi.fn()}
        onResetPassword={vi.fn()}
        error="Invalid or expired reset link"
      />,
    )

    expect(screen.getByText('Invalid or expired reset link')).not.toBeNull()
  })
})
