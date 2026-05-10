'use client'

import { use } from 'react'
import { usePublicTrip } from '@/hooks/useTrips'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Navigation } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PublicTripPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: trip, isLoading, error } = usePublicTrip(params.id)

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading trip...</div>
  if (error || !trip) return <div className="min-h-screen flex items-center justify-center text-red-500">Trip not found or not public.</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">Traveloop</Link>
        <Link href="/signup">
          <Button variant="outline" size="sm">Create your own trip</Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{trip.title}</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{trip.description}</p>
          <div className="flex items-center justify-center gap-2 text-gray-600 bg-white shadow-sm inline-flex px-4 py-2 rounded-full border border-gray-100">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Navigation className="w-6 h-6 text-blue-500" />
              Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {trip.stops?.map((stop: any, index: number) => (
                <div key={stop.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/30 transition-colors">
                  <div className="md:w-1/4 space-y-1">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">
                        {index + 1}
                      </div>
                      {stop.city_name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 ml-8">
                      <MapPin className="w-3 h-3" /> {stop.country}
                    </div>
                    <div className="text-sm text-gray-600 ml-8 mt-2 font-medium">
                      {formatDate(stop.start_date)} to {formatDate(stop.end_date)}
                    </div>
                  </div>
                  
                  <div className="md:w-3/4 space-y-3">
                    {stop.activities?.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {stop.activities.map((act: any) => (
                          <div key={act.id} className="bg-white border rounded-lg p-3 shadow-sm">
                            <h4 className="font-medium text-gray-900">{act.title}</h4>
                            {act.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{act.description}</p>}
                            <div className="mt-2 flex items-center justify-between text-xs font-medium">
                              <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 capitalize">{act.category}</span>
                              {act.cost > 0 && <span className="text-green-600">${act.cost}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic py-2">No specific activities planned for this stop yet.</div>
                    )}
                  </div>
                </div>
              ))}
              {!trip.stops?.length && (
                <div className="p-8 text-center text-gray-500">
                  This trip has no stops planned yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
