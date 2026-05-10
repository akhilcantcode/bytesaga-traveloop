import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Stop } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useStops(tripId: string) {
  return useQuery<Stop[]>({
    queryKey: QUERY_KEYS.stops.byTrip(tripId),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}/stops`)
      return data
    },
    enabled: !!tripId,
  })
}

export function useCreateStop(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Stop>) => {
      const { data } = await api.post(`/trips/${tripId}/stops`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stops.byTrip(tripId) })
    },
  })
}

export function useUpdateStop(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Stop> & { id: string }) => {
      const { data } = await api.put(`/stops/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stops.byTrip(tripId) })
    },
  })
}

export function useReorderStops(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string; order_index: number }[]) => {
      const { data } = await api.patch('/stops/reorder', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stops.byTrip(tripId) })
    },
  })
}

export function useDeleteStop(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/stops/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stops.byTrip(tripId) })
    },
  })
}
