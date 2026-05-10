import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface DashboardStats {
  total_trips: number
  total_countries: number
  total_spent: number
  upcoming_budget: number
}

export interface DashboardDestination {
  id: string
  name: string
  country: string
  image: string
}

export interface DashboardSuggestedTrip {
  id: string
  title: string
  duration: string
  price: string
  image: string
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data
    }
  })
}

export function useDashboardDestinations() {
  return useQuery<DashboardDestination[]>({
    queryKey: ['dashboard', 'destinations'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/destinations')
      return data
    }
  })
}

export function useDashboardSuggestedTrips() {
  return useQuery<DashboardSuggestedTrip[]>({
    queryKey: ['dashboard', 'suggested-trips'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/suggested-trips')
      return data
    }
  })
}
