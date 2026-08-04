// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { ProfileForm } from '#/components/profile/ProfileForm'
import type { ProfileResponse } from '#/lib/interfaces/profile-response.interface'

const deleteProfileMock = vi.fn()
let deleteProfileState: { isPending: boolean } = { isPending: false }

vi.mock('#/api/auth/delete-profile.auth', () => ({
  useDeleteProfile: () => ({
    mutate: deleteProfileMock,
    isPending: deleteProfileState.isPending,
  }),
}))

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AvatarImage: ({ src }: { src?: string }) =>
    src ? <img data-testid="avatar-image" src={src} alt="Profile" /> : null,
  AvatarFallback: ({ children }: { children: ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}))

const baseProfile: ProfileResponse = {
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
  profilePhotoUrl: null,
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  deleteProfileState = { isPending: false }
})

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:mock-preview-url')
  URL.revokeObjectURL = vi.fn()
})

describe('ProfileForm - view mode', () => {
  it('renders the profile fields as read-only with Edit and Delete actions', () => {
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Full Name')).toHaveProperty('readOnly', true)
    expect(screen.getByLabelText('Username')).toHaveProperty('readOnly', true)
    expect(screen.getByLabelText('Email')).toHaveProperty('readOnly', true)
    expect(screen.getByRole('button', { name: 'Edit Profile' })).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Delete Account' }),
    ).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Save Changes' })).toBeNull()
  })

  it('shows initials in the avatar fallback when there is no profile photo', () => {
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    expect(screen.getByTestId('avatar-fallback').textContent).toBe('JD')
  })

  it('disables the file input and "Change Photo" button while not editing', () => {
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Upload profile photo')).toHaveProperty(
      'disabled',
      true,
    )
    expect(screen.getByRole('button', { name: 'Change Photo' })).toHaveProperty(
      'disabled',
      true,
    )
  })
})

describe('ProfileForm - editing', () => {
  it('switches to edit mode and shows Save/Cancel buttons', () => {
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))

    expect(screen.getByLabelText('Full Name')).toHaveProperty('readOnly', false)
    expect(screen.getByRole('button', { name: 'Save Changes' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Edit Profile' })).toBeNull()
  })

  it('submits the updated values and returns to view mode on success', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProfileForm profile={baseProfile} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Janet Doe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Janet Doe', avatar: null }),
      )
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Edit Profile' }),
      ).not.toBeNull()
    })
  })

  it('resets the form and returns to view mode on cancel without submitting', () => {
    const onSubmit = vi.fn()
    render(<ProfileForm profile={baseProfile} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Someone Else' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Edit Profile' })).not.toBeNull()
    expect(screen.getByLabelText('Full Name').value).toBe('Jane Doe')
  })

  it('updates the avatar preview when a new photo is selected', () => {
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }))

    const file = new File(['content'], 'avatar.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText('Upload profile photo'), {
      target: { files: [file] },
    })

    expect(screen.getByTestId('avatar-image').getAttribute('src')).toBe(
      'blob:mock-preview-url',
    )
  })
})

describe('ProfileForm - delete account', () => {
  it('deletes the profile when the user confirms the dialog', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }))

    expect(deleteProfileMock).toHaveBeenCalled()
  })

  it('does not delete the profile when the user cancels the dialog', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }))

    expect(deleteProfileMock).not.toHaveBeenCalled()
  })

  it('disables Edit and Delete buttons and shows a deleting label while pending', () => {
    deleteProfileState = { isPending: true }
    render(<ProfileForm profile={baseProfile} onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Edit Profile' })).toHaveProperty(
      'disabled',
      true,
    )
    expect(screen.getByRole('button', { name: 'Deleting...' })).toHaveProperty(
      'disabled',
      true,
    )
  })
})
