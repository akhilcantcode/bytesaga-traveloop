'use client'

import { Trip } from '@/types'
import TripCard from '@/components/trips/TripCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'

export default function TripsPage() {
  const { data: trips, isLoading, isError } = useTrips()

  if (isLoading) return <div className="p-8 text-center">Loading trips...</div>
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load trips.</div>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-gray-500">View and manage all your trips.</p>
        </div>
        <Link href="/trips/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips?.length ? (
          trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))
        ) : (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">No trips found. Start planning your first adventure!</p>
            <Link href="/trips/new">
              <Button variant="outline">Plan a new trip</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
