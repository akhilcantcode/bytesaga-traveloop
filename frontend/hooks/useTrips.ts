import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Trip, BudgetSummary } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useTrips() {
  return useQuery<Trip[]>({
    queryKey: QUERY_KEYS.trips.all,
    queryFn: async () => {
      const { data } = await api.get('/trips')
      return data
    },
  })
}

export function useTrip(id: string) {
  return useQuery<Trip>({
    queryKey: QUERY_KEYS.trips.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function usePublicTrip(id: string) {
  return useQuery<any>({
    queryKey: ['public', 'trips', id],
    queryFn: async () => {
      const { data } = await api.get(`/public/trips/${id}`)
      return data
    },
    enabled: !!id,
    retry: 1, // Don't retry too much if it's 404/not public
  })
}

export function useTripBudget(id: string) {
  return useQuery<BudgetSummary>({
    queryKey: QUERY_KEYS.trips.budget(id),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${id}/budget`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Trip>) => {
      const { data } = await api.post('/trips', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all })
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Trip> & { id: string }) => {
      const { data } = await api.put(`/trips/${id}`, payload)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.detail(variables.id) })
    },
  })
}
