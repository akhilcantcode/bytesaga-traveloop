import { create } from 'zustand'
import { Trip } from '@/types'

interface TripState {
  activeTrip: Trip | null
  setActiveTrip: (trip: Trip | null) => void
}

export const useTripStore = create<TripState>()((set) => ({
  activeTrip: null,
  setActiveTrip: (trip) => set({ activeTrip: trip }),
}))
