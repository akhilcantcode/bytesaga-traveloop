'use client'

import { Trip } from '@/types'
import TripCard from '@/components/trips/TripCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Compass, Sparkles } from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'

export default function TripsPage() {
  const { data: trips, isLoading, isError } = useTrips()

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
      <p className="text-sky-800 font-medium animate-pulse">Loading your adventures...</p>
    </div>
  )
  
  if (isError) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="font-medium">Failed to load trips. Please try again later.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 relative pb-10">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-sky-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/50 border border-sky-200/50 text-sky-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Your Journey Starts Here</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-800 via-blue-700 to-indigo-800 drop-shadow-sm">
            My Trips
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-lg leading-relaxed">
            View, manage, and plan all your upcoming adventures in one beautiful place.
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold h-14 px-8 shadow-[0_8px_20px_-4px_rgba(14,165,233,0.5)] hover:shadow-[0_12px_25px_-4px_rgba(14,165,233,0.6)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl" />
            <span className="relative flex items-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              Plan New Trip
            </span>
          </Button>
        </Link>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {trips?.length ? (
          trips.map(trip => (
            <div key={trip.id} className="transition-transform duration-500 hover:-translate-y-2">
              <TripCard trip={trip} />
            </div>
          ))
        ) : (
          <div className="col-span-full relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-12 text-center min-h-[400px] flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-white/20 to-indigo-50/50 opacity-50" />
            
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-sky-200 rounded-full blur-2xl group-hover:bg-sky-300 transition-colors duration-700 opacity-60 animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-white to-sky-50 rounded-full shadow-xl border border-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                <Compass className="w-14 h-14 text-sky-500 group-hover:text-blue-600 transition-colors duration-500 group-hover:rotate-45" />
              </div>
            </div>

            <h3 className="text-3xl font-extrabold text-slate-800 mb-3 relative z-10">No adventures yet</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-md relative z-10 text-lg">
              The world is waiting for you. Start planning your first incredible journey today!
            </p>
            
            <Link href="/trips/new" className="relative z-10">
              <Button className="rounded-2xl bg-white text-sky-600 hover:bg-sky-50 hover:text-sky-700 border border-sky-100 font-bold h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group/btn">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                  Start Exploring
                </span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
