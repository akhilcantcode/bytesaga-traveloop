import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { TripNote } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useNotes(tripId: string) {
  return useQuery<TripNote[]>({
    queryKey: QUERY_KEYS.notes.byTrip(tripId),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}/notes`)
      return data
    },
    enabled: !!tripId,
  })
}

export function useCreateNote(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<TripNote>) => {
      const { data } = await api.post(`/trips/${tripId}/notes`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.byTrip(tripId) })
    },
  })
}

export function useUpdateNote(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<TripNote> & { id: string }) => {
      const { data } = await api.put(`/notes/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.byTrip(tripId) })
    },
  })
}

export function useDeleteNote(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.byTrip(tripId) })
    },
  })
}
