// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'

const apiPostMock = vi.fn()
const navigateMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock('#/api/http', () => ({
  api: { post: apiPostMock },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock },
}))

const { useRequestPasswordReset, useResetPassword } =
  await import('#/api/auth/reset-password.auth')

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useRequestPasswordReset', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends the request and shows a success toast on a 202 response', async () => {
    apiPostMock.mockResolvedValue({ status: 202 })

    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createWrapper(queryClient),
    })

    await result.current.mutateAsync({ email: 'user@example.com' })

    expect(apiPostMock).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'user@example.com',
    })
    expect(toastSuccessMock).toHaveBeenCalledWith('Password reset email sent', {
      position: 'bottom-right',
    })
  })

  it('throws the server-provided message when the request is rejected', async () => {
    apiPostMock.mockResolvedValue({
      status: 400,
      data: { message: 'Email not found' },
    })

    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ email: 'user@example.com' }),
    ).rejects.toThrow('Email not found')

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Email not found', {
        position: 'bottom-right',
      })
    })
  })

  it('falls back to a default message when the server provides none', async () => {
    apiPostMock.mockResolvedValue({ status: 500, data: {} })

    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ email: 'user@example.com' }),
    ).rejects.toThrow('Could not request password reset')
  })

  it('rejects and shows an error toast for an invalid email without calling the API', async () => {
    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ email: 'not-an-email' }),
    ).rejects.toThrow()

    expect(apiPostMock).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled()
    })
  })
})

describe('useResetPassword', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('resets the password and redirects to login on success', async () => {
    apiPostMock.mockResolvedValue({ status: 200 })

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(queryClient),
    })

    await result.current.mutateAsync({
      token: 'reset-token',
      password: 'password123',
      confirmPassword: 'password123',
    })

    expect(apiPostMock).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token',
      password: 'password123',
    })
    expect(toastSuccessMock).toHaveBeenCalledWith('Password reset successful', {
      position: 'bottom-right',
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      replace: true,
    })
  })

  it('throws the server-provided message and does not navigate when the reset link is invalid', async () => {
    apiPostMock.mockResolvedValue({
      status: 400,
      data: { message: 'Invalid or expired reset link' },
    })

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({
        token: 'bad-token',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    ).rejects.toThrow('Invalid or expired reset link')

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('rejects without calling the API when the passwords do not match', async () => {
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({
        token: 'reset-token',
        password: 'password123',
        confirmPassword: 'different123',
      }),
    ).rejects.toThrow()

    expect(apiPostMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
