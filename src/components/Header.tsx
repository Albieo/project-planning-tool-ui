import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '#/hooks/useAuth'
import { AvatarDropdown } from './AvatarDropdown'
import { Logo } from './ui/logo'

/**
 * Renders the application's sticky navigation header with route links, authentication controls, and a theme toggle.
 */
export default function Header() {
  const { data, isLoading } = useAuth()

  const isAuthenticated = data?.authenticated === true

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center justify-between gap-y-2 py-3 sm:py-4 f-full">
        {/* Logo */}
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to="/">
            <Logo />
          </Link>
        </h2>

        {/* Nav */}
        <div className="flex items-center gap-2">
          <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:w-auto sm:flex-nowrap sm:pb-0">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Home
            </Link>

            {!isAuthenticated && !isLoading && (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  activeProps={{ className: 'nav-link is-active' }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="nav-link"
                  activeProps={{ className: 'nav-link is-active' }}
                >
                  Get Started
                </Link>
              </>
            )}
            {isAuthenticated && <AvatarDropdown />}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
