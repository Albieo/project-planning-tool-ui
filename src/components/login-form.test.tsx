// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { LoginForm } from '#/components/login-form'

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

describe('LoginForm', () => {
  it('renders the email and password fields and a submit button', () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Email')).not.toBeNull()
    expect(screen.getByLabelText('Password')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Login' })).not.toBeNull()
  })

  it('links "Forgot your password?" to the reset-password route', () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    const link = screen.getByRole('link', { name: 'Forgot your password?' })
    expect(link.getAttribute('href')).toBe('/reset-password')
  })

  it('submits the entered credentials', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })
    })
  })

  it('does not call onSubmit when the credentials are invalid', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'not-an-email' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('displays the provided error message', () => {
    render(<LoginForm onSubmit={vi.fn()} error="Invalid credentials" />)

    expect(screen.getByText('Invalid credentials')).not.toBeNull()
  })

  it('shows a loading label on the submit button when isLoading is true', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />)

    expect(
      screen.getByRole('button', { name: 'Logging in...' }),
    ).not.toBeNull()
  })
})