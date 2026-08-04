// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProfileContainer } from '#/components/containers/profile.container'
import type { UpdateProfilePayload } from '#/lib/interfaces/update-profile-payload.interface'

const useGetProfileMock = vi.fn()
const mutateAsyncMock = vi.fn()
const useUpdateProfileMock = vi.fn()

vi.mock('#/api/auth/get-profile.auth', () => ({
  useGetProfile: () => useGetProfileMock(),
}))

vi.mock('#/api/auth/update-profile.auth', () => ({
  useUpdateProfile: () => useUpdateProfileMock(),
}))

let capturedOnSubmit: ((data: UpdateProfilePayload) => Promise<void>) | null =
  null

vi.mock('#/components/profile/ProfileForm', () => ({
  ProfileForm: (props: {
    profile: unknown
    isLoading?: boolean
    onSubmit: (data: UpdateProfilePayload) => Promise<void>
  }) => {
    capturedOnSubmit = props.onSubmit
    return (
      <div data-testid="profile-form">
        <span data-testid="loading">{String(props.isLoading)}</span>
        <span data-testid="profile">{JSON.stringify(props.profile)}</span>
      </div>
    )
  },
}))

const profile = {
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
  profilePhotoUrl: null,
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  capturedOnSubmit = null
})

describe('ProfileContainer', () => {
  it('renders nothing while the profile is unavailable', () => {
    useGetProfileMock.mockReturnValue({ data: undefined })
    useUpdateProfileMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })

    const { container } = render(<ProfileContainer />)

    expect(container.firstChild).toBeNull()
  })

  it('renders the ProfileForm with the profile and loading state', () => {
    useGetProfileMock.mockReturnValue({ data: profile })
    useUpdateProfileMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: true,
    })

    render(<ProfileContainer />)

    expect(screen.getByTestId('profile-form')).not.toBeNull()
    expect(screen.getByTestId('loading').textContent).toBe('true')
    expect(screen.getByTestId('profile').textContent).toBe(JSON.stringify(profile))
  })

  it('calls mutateAsync with the submitted data', async () => {
    useGetProfileMock.mockReturnValue({ data: profile })
    useUpdateProfileMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
    mutateAsyncMock.mockResolvedValue(undefined)

    render(<ProfileContainer />)

    expect(screen.getByTestId('profile').textContent).toBe(JSON.stringify(profile))

    const payload: UpdateProfilePayload = {
      name: 'Updated Name',
      username: 'updated',
      email: 'updated@example.com',
      avatar: null,
    }
    await capturedOnSubmit?.(payload)

    expect(mutateAsyncMock).toHaveBeenCalledWith(payload)
  })

  it('does not throw when the update mutation rejects', async () => {
    useGetProfileMock.mockReturnValue({ data: profile })
    useUpdateProfileMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
    mutateAsyncMock.mockRejectedValue(new Error('Failed to update profile'))

    render(<ProfileContainer />)

    expect(screen.getByTestId('profile').textContent).toBe(JSON.stringify(profile))

    const payload: UpdateProfilePayload = {
      name: 'Updated Name',
      username: 'updated',
      email: 'updated@example.com',
      avatar: null,
    }

    await expect(capturedOnSubmit?.(payload)).resolves.toBeUndefined()
    expect(mutateAsyncMock).toHaveBeenCalledWith(payload)
  })
})
