// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'

const apiPatchMock = vi.fn()
const apiPostMock = vi.fn()
const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()

vi.mock('#/api/http', () => ({
  api: { patch: apiPatchMock, post: apiPostMock },
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock },
}))

const { useUpdateProfile } = await import('#/api/auth/update-profile.auth')

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const baseProfile = {
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
}

describe('useUpdateProfile', () => {
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

  it('sends name, username, and email in the patch request', async () => {
    apiPatchMock.mockResolvedValue({ status: 200, data: baseProfile })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await result.current.mutateAsync({ ...baseProfile, avatar: null })

    expect(apiPatchMock).toHaveBeenCalledWith('/auth/profile', baseProfile)
    expect(queryClient.getQueryData(['auth', 'profile'])).toEqual(baseProfile)
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Profile updated successfully',
    )
  })

  it('uploads the avatar and merges the returned url into the profile when provided', async () => {
    apiPatchMock.mockResolvedValue({ status: 200, data: baseProfile })
    apiPostMock.mockResolvedValue({
      status: 200,
      data: { url: 'http://backend/uploads/avatar.png', message: 'ok' },
    })
    const avatar = new File(['content'], 'avatar.png', {
      type: 'image/png',
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    const profile = await result.current.mutateAsync({
      ...baseProfile,
      avatar,
    })

    expect(apiPostMock).toHaveBeenCalledWith(
      '/auth/upload-profile-photo',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    expect(profile).toEqual({
      ...baseProfile,
      profilePhotoUrl: 'http://backend/uploads/avatar.png',
    })
  })

  it('throws a username-taken error on a 409 response without uploading a photo', async () => {
    apiPatchMock.mockResolvedValue({ status: 409, data: undefined })
    const avatar = new File(['content'], 'avatar.png', {
      type: 'image/png',
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ ...baseProfile, avatar }),
    ).rejects.toThrow('That username is already taken')

    expect(apiPostMock).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'That username is already taken',
      )
    })
  })

  it('throws a generic error for other profile update failures', async () => {
    apiPatchMock.mockResolvedValue({ status: 500, data: undefined })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ ...baseProfile, avatar: null }),
    ).rejects.toThrow('Failed to update profile')
  })

  it('prefers the message field over the error field when the photo upload fails', async () => {
    apiPatchMock.mockResolvedValue({ status: 200, data: baseProfile })
    apiPostMock.mockResolvedValue({
      status: 400,
      data: { message: 'File is too large', error: 'ignored' },
    })
    const avatar = new File(['content'], 'avatar.png', {
      type: 'image/png',
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ ...baseProfile, avatar }),
    ).rejects.toThrow('File is too large')
  })

  it('falls back to the error field when message is absent on a failed photo upload', async () => {
    apiPatchMock.mockResolvedValue({ status: 200, data: baseProfile })
    apiPostMock.mockResolvedValue({
      status: 400,
      data: { error: 'Unsupported file type' },
    })
    const avatar = new File(['content'], 'avatar.png', {
      type: 'image/png',
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ ...baseProfile, avatar }),
    ).rejects.toThrow('Unsupported file type')
  })

  it('falls back to a default message when the upload failure has no message or error', async () => {
    apiPatchMock.mockResolvedValue({ status: 200, data: baseProfile })
    apiPostMock.mockResolvedValue({ status: 400, data: {} })
    const avatar = new File(['content'], 'avatar.png', {
      type: 'image/png',
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    })

    await expect(
      result.current.mutateAsync({ ...baseProfile, avatar }),
    ).rejects.toThrow('Failed to upload profile photo')
  })
})