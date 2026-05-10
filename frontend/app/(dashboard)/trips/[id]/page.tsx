'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Navigation, Share2, Globe, Lock, Copy, Check, Map as MapIcon, ArrowRight, Wallet } from 'lucide-react'
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

  if (isTripLoading || isStopsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
      <p className="text-blue-800 font-medium animate-pulse">Loading trip details...</p>
    </div>
  )
  if (!trip) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="font-medium">Trip not found.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Decorative blobs */}
      <div className="absolute top-[0%] left-[-10%] w-[400px] h-[400px] bg-blue-300/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-cyan-300/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <MapIcon className="w-4 h-4 text-blue-500" />
            <span>Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            {trip.title}
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            {trip.description || "Get ready for an amazing journey."}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/80 shadow-sm">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-slate-700">
              {formatDate(trip.start_date)} <ArrowRight className="inline w-3 h-3 text-slate-400 mx-1" /> {formatDate(trip.end_date)}
            </span>
          </div>
          {trip.total_budget && (
            <div className="flex items-center gap-2 bg-emerald-50/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-100 shadow-sm text-emerald-700">
              <Wallet className="w-5 h-5" />
              <span className="font-bold">${trip.total_budget.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Itinerary Timeline */}
        <div className="lg:col-span-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-500" />
              Itinerary Outline
            </h2>
            
            <div className="relative pl-2">
              {stops?.length ? (
                <div className="space-y-6">
                  {/* Continuous vertical line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-200 via-cyan-200 to-transparent rounded-full" />
                  
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="relative z-10 flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm group-hover:border-blue-300 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            {stop.city_name}
                            <span className="text-sm font-medium text-slate-400">, {stop.country}</span>
                          </h3>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-sm font-medium text-slate-500">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {formatDate(stop.start_date)} - {formatDate(stop.end_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-300" />
                  </div>
                  <p className="text-slate-600 font-medium">No stops planned yet.</p>
                  <p className="text-slate-400 text-sm">Head over to the Builder to add your first destination!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[2.5rem] p-8 text-white shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] relative overflow-hidden">
            <h2 className="text-2xl font-bold mb-2 relative z-10 flex items-center gap-2">
              Share Trip
            </h2>
            <p className="text-blue-100 text-sm mb-6 relative z-10">
              Let your friends and family see your amazing itinerary.
            </p>
            
            <div className="relative z-10 space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${trip.is_public ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>
                    {trip.is_public ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{trip.is_public ? 'Public Link Active' : 'Private Trip'}</p>
                    <p className="text-xs text-blue-100/70">
                      {trip.is_public ? 'Anyone with the link can view' : 'Only you can view this'}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={togglePublic}
                  disabled={updateTrip.isPending}
                  className={`w-full rounded-xl h-12 font-bold transition-all duration-300 ${trip.is_public ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:-translate-y-0.5'}`}
                >
                  {trip.is_public ? 'Make Private' : 'Publish Trip'}
                </Button>
              </div>

              {trip.is_public && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Button 
                    className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-300 group" 
                    onClick={copyPublicLink}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Link Copied!</span>
                    ) : (
                      <span className="flex items-center gap-2"><Copy className="w-5 h-5 group-hover:scale-110 transition-transform" /> Copy Public Link</span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
