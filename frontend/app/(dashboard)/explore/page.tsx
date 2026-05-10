'use client'

import { Search, MapPin, Compass, Heart, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { useDashboardDestinations, useDashboardSuggestedTrips } from '@/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExplorePage() {
  const { data: destinations, isLoading: destLoading } = useDashboardDestinations()
  const { data: suggestedTrips, isLoading: tripsLoading } = useDashboardSuggestedTrips()

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm ring-1 ring-white/60">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore</h1>
          <p className="text-sky-700/80 mt-1 font-medium">Discover your next adventure</p>
        </div>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600/60" />
          <input 
            type="text" 
            placeholder="Search destinations, trips, or activities..." 
            className="w-full pl-10 pr-4 py-3 bg-white/60 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Featured Destinations */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-sky-500" />
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trending Destinations</h2>
        </div>

        {destLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/40 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(destinations || []).map((dest, i) => (
              <Link href={`/explore/destinations/${dest.id}`} key={i}>
                <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-sm ring-1 ring-black/5">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-bold text-2xl drop-shadow-md">{dest.name}</span>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-red-500 transition-colors shadow-sm">
                        <Heart className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sky-100 text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.country}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Public Trips Feed */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Community Trips</h2>
        </div>

        {tripsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-white/40 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(suggestedTrips || []).map((trip, i) => (
              <Link href={`/explore/trips/${trip.id}`} key={i}>
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm ring-1 ring-white/60 hover:shadow-md transition-all duration-300 group h-full flex flex-col">
                  <div className="h-32 overflow-hidden relative">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900">
                      {trip.duration}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{trip.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-auto">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        <span>Anytime</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-2 rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 group-hover:bg-sky-50 transition-colors">
                      View Itinerary
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
