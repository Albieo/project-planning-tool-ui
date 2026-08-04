// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResetPasswordContainer } from '#/components/containers/reset-password.container'

const useRequestPasswordResetMock = vi.fn()
const useResetPasswordMock = vi.fn()
const requestMutateAsyncMock = vi.fn()
const resetMutateAsyncMock = vi.fn()

vi.mock('#/api/auth/reset-password.auth', () => ({
  useRequestPasswordReset: () => useRequestPasswordResetMock(),
  useResetPassword: () => useResetPasswordMock(),
}))

let capturedProps: {
  token?: string
  isLoading?: boolean
  error?: string
  onRequestReset: (data: { email: string }) => Promise<void>
  onResetPassword: (data: {
    token: string
    password: string
    confirmPassword: string
  }) => Promise<void>
} | null = null

vi.mock('#/components/reset-password-form', () => ({
  ResetPasswordForm: (props: {
    token?: string
    isLoading?: boolean
    error?: string
    onRequestReset: (data: { email: string }) => Promise<void>
    onResetPassword: (data: {
      token: string
      password: string
      confirmPassword: string
    }) => Promise<void>
  }) => {
    capturedProps = props
    return (
      <div data-testid="reset-password-form">
        <span data-testid="token">{props.token}</span>
        <span data-testid="loading">{String(props.isLoading)}</span>
        <span data-testid="error">{props.error}</span>
      </div>
    )
  },
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  capturedProps = null
})

describe('ResetPasswordContainer without a token', () => {
  it('reflects the request-reset mutation state', () => {
    useRequestPasswordResetMock.mockReturnValue({
      mutateAsync: requestMutateAsyncMock,
      isPending: true,
      error: new Error('Could not request password reset'),
    })
    useResetPasswordMock.mockReturnValue({
      mutateAsync: resetMutateAsyncMock,
      isPending: false,
      error: undefined,
    })

    render(<ResetPasswordContainer />)

    expect(screen.getByTestId('loading').textContent).toBe('true')
    expect(screen.getByTestId('error').textContent).toBe(
      'Could not request password reset',
    )
    expect(screen.getByTestId('token').textContent).toBe('')
  })

  it('forwards onRequestReset to the request mutation and swallows rejections', async () => {
    useRequestPasswordResetMock.mockReturnValue({
      mutateAsync: requestMutateAsyncMock,
      isPending: false,
      error: undefined,
    })
    useResetPasswordMock.mockReturnValue({
      mutateAsync: resetMutateAsyncMock,
      isPending: false,
      error: undefined,
    })
    requestMutateAsyncMock.mockRejectedValue(new Error('boom'))

    render(<ResetPasswordContainer />)

    await expect(
      capturedProps?.onRequestReset({ email: 'user@example.com' }),
    ).resolves.toBeUndefined()
    expect(requestMutateAsyncMock).toHaveBeenCalledWith({
      email: 'user@example.com',
    })
  })
})

describe('ResetPasswordContainer with a token', () => {
  it('reflects the reset-password mutation state and passes the token through', () => {
    useRequestPasswordResetMock.mockReturnValue({
      mutateAsync: requestMutateAsyncMock,
      isPending: false,
      error: undefined,
    })
    useResetPasswordMock.mockReturnValue({
      mutateAsync: resetMutateAsyncMock,
      isPending: true,
      error: new Error('Invalid or expired reset link'),
    })

    render(<ResetPasswordContainer token="reset-token" />)

    expect(screen.getByTestId('token').textContent).toBe('reset-token')
    expect(screen.getByTestId('loading').textContent).toBe('true')
    expect(screen.getByTestId('error').textContent).toBe(
      'Invalid or expired reset link',
    )
  })

  it('forwards onResetPassword to the reset mutation and swallows rejections', async () => {
    useRequestPasswordResetMock.mockReturnValue({
      mutateAsync: requestMutateAsyncMock,
      isPending: false,
      error: undefined,
    })
    useResetPasswordMock.mockReturnValue({
      mutateAsync: resetMutateAsyncMock,
      isPending: false,
      error: undefined,
    })
    resetMutateAsyncMock.mockRejectedValue(new Error('boom'))

    render(<ResetPasswordContainer token="reset-token" />)

    await expect(
      capturedProps?.onResetPassword({
        token: 'reset-token',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    ).resolves.toBeUndefined()
    expect(resetMutateAsyncMock).toHaveBeenCalledWith({
      token: 'reset-token',
      password: 'password123',
      confirmPassword: 'password123',
    })
  })
})
