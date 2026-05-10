import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface PlatformStats {
  total_users: number
  total_trips: number
  total_expenses: number
}

export interface PopularCity {
  city_name: string
  country: string
  count: number
}

export function useAdminStats() {
  return useQuery<PlatformStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats')
      return data
    },
  })
}

export function useAdminPopularCities() {
  return useQuery<{ cities: PopularCity[] }>({
    queryKey: ['admin', 'popular-cities'],
    queryFn: async () => {
      const { data } = await api.get('/admin/cities/popular')
      return data
    },
  })
}

export function useAdminUsers() {
  return useQuery<any[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users')
      return data
    },
  })
}
