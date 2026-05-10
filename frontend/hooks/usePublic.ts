import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Trip } from '@/types'

export function usePublicTrip(id: string) {
  return useQuery<Trip>({
    queryKey: ['public', 'trips', id],
    queryFn: async () => {
      const { data } = await api.get(`/public/trips/${id}`)
      return data
    },
    enabled: !!id
  })
}
