// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'

const apiPostMock = vi.fn()
const navigateMock = vi.fn()
const invalidateMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock('#/api/http', () => ({
  api: { post: apiPostMock },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  useRouter: () => ({ invalidate: invalidateMock }),
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock },
}))

const { useLogout } = await import('#/api/auth/logout.auth')

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useLogout', () => {
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

  it('updates the auth cache, removes the profile cache, invalidates the router, and redirects on success', async () => {
    apiPostMock.mockResolvedValue({ status: 200, data: { ok: true } })
    const cancelSpy = vi.spyOn(queryClient, 'cancelQueries')
    const removeSpy = vi.spyOn(queryClient, 'removeQueries')

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(queryClient),
    })

    await result.current.mutateAsync()

    expect(cancelSpy).toHaveBeenCalledWith({ queryKey: ['auth'] })
    expect(queryClient.getQueryData(['auth'])).toEqual({
      authenticated: false,
    })
    expect(removeSpy).toHaveBeenCalledWith({
      queryKey: ['auth', 'profile'],
      exact: true,
    })
    expect(invalidateMock).toHaveBeenCalled()
    expect(toastSuccessMock).toHaveBeenCalledWith('Logged out successfully')
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      replace: true,
    })
  })

  it('throws and shows an error toast when the logout request fails', async () => {
    apiPostMock.mockResolvedValue({ status: 401, data: undefined })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(result.current.mutateAsync()).rejects.toThrow(
      'Failed to log out',
    )

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to log out')
    })

    expect(invalidateMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})