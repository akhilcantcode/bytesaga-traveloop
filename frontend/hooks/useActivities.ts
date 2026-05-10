import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Activity } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useActivities(stopId: string) {
  return useQuery<Activity[]>({
    queryKey: QUERY_KEYS.activities.byStop(stopId),
    queryFn: async () => {
      const { data } = await api.get(`/stops/${stopId}/activities`)
      return data
    },
    enabled: !!stopId,
  })
}

export function useCreateActivity(stopId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Activity>) => {
      const { data } = await api.post(`/stops/${stopId}/activities`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities.byStop(stopId) })
    },
  })
}

export function useUpdateActivity(stopId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Activity> & { id: string }) => {
      const { data } = await api.put(`/activities/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities.byStop(stopId) })
    },
  })
}

export function useDeleteActivity(stopId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/activities/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities.byStop(stopId) })
    },
  })
}
