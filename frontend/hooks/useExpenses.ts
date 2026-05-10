import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Expense } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

// Assuming we want a query key for expenses by trip, though it's not in lib/queryKeys.ts
// We'll add it inline here or update queryKeys.ts later if needed.
const getExpensesQueryKey = (tripId: string) => ['expenses', tripId] as const

export function useExpenses(tripId: string) {
  return useQuery<Expense[]>({
    queryKey: getExpensesQueryKey(tripId),
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}/expenses`)
      return data
    },
    enabled: !!tripId,
  })
}

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Expense>) => {
      const { data } = await api.post(`/trips/${tripId}/expenses`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getExpensesQueryKey(tripId) })
      // Also invalidate budget since expenses affect it
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.budget(tripId) })
    },
  })
}

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/expenses/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getExpensesQueryKey(tripId) })
      // Also invalidate budget since expenses affect it
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.budget(tripId) })
    },
  })
}
