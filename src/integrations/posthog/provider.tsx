import { useEffect, useState, type ComponentType, type ReactNode } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

type LoadedPostHogProvider = ComponentType<{
  client: unknown
  children: ReactNode
}>

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const [provider, setProvider] = useState<LoadedPostHogProvider | null>(null)
  const [client, setClient] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true

    if (!import.meta.env.VITE_POSTHOG_KEY) {
      return
    }

    Promise.all([import('@posthog/react'), import('posthog-js')])
      .then(([posthogReact, posthogModule]) => {
        const posthog = posthogModule.default

        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
          api_host:
            import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false,
          defaults: '2025-11-30',
        })

        if (!mounted) {
          return
        }

        setClient(posthog)
        setProvider(() => posthogReact.PostHogProvider)
      })
      .catch(() => {
        // Analytics is non-critical; leave the app shell alone if it fails.
      })

    return () => {
      mounted = false
    }
  }, [])

  if (!provider || !client) {
    return <>{children}</>
  }

  const LoadedProvider = provider
  return <LoadedProvider client={client}>{children}</LoadedProvider>
}
