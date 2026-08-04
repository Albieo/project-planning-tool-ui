// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import Header from '#/components/Header'

const useAuthMock = vi.fn()

vi.mock('#/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('./ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

vi.mock('./AvatarDropdown', () => ({
  AvatarDropdown: () => <div data-testid="avatar-dropdown" />,
}))

vi.mock('./ui/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Header', () => {
  it('renders the Logo component linked to the home route', () => {
    useAuthMock.mockReturnValue({ data: undefined, isLoading: false })

    render(<Header />)

    const logo = screen.getByTestId('logo')
    expect(logo).not.toBeNull()
    expect(logo.closest('a')?.getAttribute('href')).toBe('/')
  })

  it('shows Login and Get Started links when unauthenticated', () => {
    useAuthMock.mockReturnValue({ data: undefined, isLoading: false })

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Login' })).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Get Started' })).not.toBeNull()
    expect(screen.queryByTestId('avatar-dropdown')).toBeNull()
  })

  it('shows the avatar dropdown instead of auth links when authenticated', () => {
    useAuthMock.mockReturnValue({
      data: { authenticated: true },
      isLoading: false,
    })

    render(<Header />)

    expect(screen.getByTestId('avatar-dropdown')).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Get Started' })).toBeNull()
  })

  it('hides auth links while the auth state is loading', () => {
    useAuthMock.mockReturnValue({ data: undefined, isLoading: true })

    render(<Header />)

    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Get Started' })).toBeNull()
    expect(screen.queryByTestId('avatar-dropdown')).toBeNull()
  })

  it('always renders the theme toggle and home link', () => {
    useAuthMock.mockReturnValue({ data: undefined, isLoading: false })

    render(<Header />)

    expect(screen.getByTestId('theme-toggle')).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Home' })).not.toBeNull()
  })
})