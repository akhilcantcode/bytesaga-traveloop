export const QUERY_KEYS = {
  trips: {
    all: ['trips'] as const,
    detail: (id: string) => ['trips', id] as const,
    budget: (id: string) => ['trips', id, 'budget'] as const,
  },
  stops: {
    byTrip: (tripId: string) => ['stops', tripId] as const,
  },
  activities: {
    byStop: (stopId: string) => ['activities', stopId] as const,
  },
  packing: {
    byTrip: (tripId: string) => ['packing', tripId] as const,
  },
  notes: {
    byTrip: (tripId: string) => ['notes', tripId] as const,
  },
}
