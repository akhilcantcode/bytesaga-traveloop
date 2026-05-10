import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface City {
  id: string
  name: string
  country: string
  cost_index: number
  popularity: number
}

export function useCity(id: string) {
  return useQuery<City>({
    queryKey: ['cities', id],
    queryFn: async () => {
      const { data } = await api.get(`/cities/${id}`)
      return data
    },
    enabled: !!id
  })
}
