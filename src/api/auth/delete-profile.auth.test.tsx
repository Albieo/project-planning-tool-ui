// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'

const apiDeleteMock = vi.fn()
const apiPostMock = vi.fn()
const navigateMock = vi.fn()
const invalidateMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock('#/api/http', () => ({
  api: {
    delete: apiDeleteMock,
    post: apiPostMock,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  useRouter: () => ({ invalidate: invalidateMock }),
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock },
}))

const { useDeleteProfile } = await import('#/api/auth/delete-profile.auth')

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDeleteProfile', () => {
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

  it('deletes the profile, logs out, clears the cache, and redirects to login', async () => {
    apiDeleteMock.mockResolvedValue({ status: 200, data: { ok: true } })
    apiPostMock.mockResolvedValue({ status: 200 })
    const clearSpy = vi.spyOn(queryClient, 'clear')

    const { result } = renderHook(() => useDeleteProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await result.current.mutateAsync()

    expect(apiDeleteMock).toHaveBeenCalledWith('/auth/profile', {
      withCredentials: true,
    })
    expect(apiPostMock).toHaveBeenCalledWith('/auth/logout')
    expect(clearSpy).toHaveBeenCalled()
    expect(invalidateMock).toHaveBeenCalled()
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Profile deleted successfully',
    )
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      replace: true,
    })
  })

  it('throws and shows an error toast when the delete request fails', async () => {
    apiDeleteMock.mockResolvedValue({ status: 400, data: undefined })

    const { result } = renderHook(() => useDeleteProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(result.current.mutateAsync()).rejects.toThrow(
      'Failed to delete profile',
    )

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Failed to delete profile')
    })

    expect(apiPostMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('does not clear the cache or navigate when the request errors', async () => {
    apiDeleteMock.mockResolvedValue({ status: 500, data: undefined })
    const clearSpy = vi.spyOn(queryClient, 'clear')

    const { result } = renderHook(() => useDeleteProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(result.current.mutateAsync()).rejects.toThrow()

    expect(clearSpy).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})
