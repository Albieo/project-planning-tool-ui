import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { api } from '#/api/http'
import type { ProfileResponse } from '#/lib/interfaces/profile-response.interface'

const getProfileServer = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { request } = ctx as { request?: Request }
  const cookieHeader = request?.headers?.get?.('cookie') ?? ''

  const res = await api.get<ProfileResponse>('/auth/profile', {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    withCredentials: false,
  })

  if (res.status >= 400) {
    throw new Error('Failed to fetch profile')
  }

  return res.data
})

export async function getProfile() {
  if (typeof window === 'undefined') {
    return getProfileServer()
  }

  const res = await api.get<ProfileResponse>('/auth/profile')

  if (res.status >= 400) {
    throw new Error('Failed to fetch profile')
  }

  return res.data
}

export const profileQuery = () => ({
  queryKey: ['auth', 'profile'],
  queryFn: getProfile,
  staleTime: 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
})

export function useGetProfile() {
  return useQuery(profileQuery())
}
