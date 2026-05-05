import { useQuery } from '@tanstack/react-query'
import { authQuery } from '#/api/auth/isAuthenticated'

export function useAuth() {
  return useQuery(authQuery())
}
