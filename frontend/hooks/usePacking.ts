import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { PackingItem } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function usePackingList(tripId: string) {
  return useQuery<PackingItem[]>({
    queryKey: QUERY_KEYS.packing.byTrip(tripId),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}/packing`)
      return data
    },
    enabled: !!tripId,
  })
}

export function useCreatePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<PackingItem>) => {
      const { data } = await api.post(`/trips/${tripId}/packing`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packing.byTrip(tripId) })
    },
  })
}

export function useTogglePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/packing/${id}/toggle`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packing.byTrip(tripId) })
    },
  })
}

export function useDeletePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/packing/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packing.byTrip(tripId) })
    },
  })
}
