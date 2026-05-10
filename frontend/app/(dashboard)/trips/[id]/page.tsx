'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Navigation, Share2, Globe, Lock, Copy, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { useTrip, useUpdateTrip } from '@/hooks/useTrips'
import { useStops } from '@/hooks/useStops'

export default function TripOverviewPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: trip, isLoading: isTripLoading } = useTrip(params.id)
  const { data: stops, isLoading: isStopsLoading } = useStops(params.id)
  const updateTrip = useUpdateTrip()
  const [copied, setCopied] = useState(false)

  const togglePublic = () => {
    if (!trip) return
    updateTrip.mutate({ id: trip.id, is_public: !trip.is_public })
  }

  const copyPublicLink = () => {
    const url = `${window.location.origin}/share/${params.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isTripLoading || isStopsLoading) return <div className="p-8 text-center">Loading trip details...</div>
  if (!trip) return <div className="p-8 text-center text-red-500">Trip not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
          <p className="text-gray-500 mt-1">{trip.description}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          </div>
          {trip.total_budget && (
            <div className="flex items-center gap-1.5 font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
              <span>Budget: ${trip.total_budget}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-500" />
                Itinerary Outline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stops?.map((stop, index) => (
                  <div key={stop.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      {index < (stops.length - 1) && (
                        <div className="w-px h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <h3 className="font-medium text-lg">{stop.city_name}, {stop.country}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(stop.start_date)} - {formatDate(stop.end_date)}
                      </p>
                    </div>
                  </div>
                ))}
                {!stops?.length && (
                  <div className="text-gray-500 text-center py-4">No stops planned yet. Go to the Builder to add some!</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-500" />
                Share Trip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${trip?.is_public ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                    {trip?.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{trip?.is_public ? 'Public' : 'Private'}</p>
                    <p className="text-xs text-gray-500">
                      {trip?.is_public ? 'Anyone with the link can view' : 'Only you can view'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant={trip?.is_public ? "default" : "outline"} 
                  size="sm"
                  onClick={togglePublic}
                  disabled={updateTrip.isPending}
                >
                  {trip?.is_public ? 'Make Private' : 'Make Public'}
                </Button>
              </div>

              {trip?.is_public && (
                <div className="pt-2">
                  <Button variant="secondary" className="w-full gap-2" onClick={copyPublicLink}>
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Public Link'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
