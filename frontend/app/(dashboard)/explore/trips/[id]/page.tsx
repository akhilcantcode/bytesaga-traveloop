'use client'

import { usePublicTrip } from '@/hooks/usePublic'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, Activity, Users, Copy } from 'lucide-react'
import { format } from 'date-fns'

export default function PublicTripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  
  const { data: trip, isLoading, isError } = usePublicTrip(tripId)

  if (isLoading) {
    return <div className="p-10 text-center text-sky-600 font-medium">Loading itinerary...</div>
  }

  if (isError || !trip) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
        <p className="text-gray-500">This trip might be private or no longer exists.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sky-700 font-medium hover:text-sky-900 transition-colors bg-white/40 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>
        
        <Button className="bg-sky-600 hover:bg-sky-700 rounded-xl px-6 shadow-sm gap-2 opacity-50 cursor-not-allowed" title="Coming Soon">
          <Copy className="w-4 h-4" /> Clone this Trip
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-sm ring-1 ring-white/60 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-full md:w-1/3 aspect-video md:aspect-square lg:aspect-video rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop" 
            alt="Trip Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Public Itinerary
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{trip.title}</h1>
          <p className="text-gray-500 text-lg leading-relaxed">{trip.description || "No description provided."}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><Calendar className="w-3.5 h-3.5" /> Start Date</span>
              <span className="font-bold text-gray-900">{format(new Date(trip.start_date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><Calendar className="w-3.5 h-3.5" /> End Date</span>
              <span className="font-bold text-gray-900">{format(new Date(trip.end_date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><DollarSign className="w-3.5 h-3.5" /> Budget</span>
              <span className="font-bold text-emerald-600">${trip.total_budget?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><Users className="w-3.5 h-3.5" /> Travelers</span>
              <span className="font-bold text-gray-900">2 Adults</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-sky-500" />
          Journey Breakdown
        </h2>
        
        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="bg-white/40 border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
            This trip has no planned stops yet.
          </div>
        ) : (
          <div className="space-y-6">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60 border-l-4 border-l-sky-500 ml-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{stop.city_name}, {stop.country}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {format(new Date(stop.start_date), 'MMM dd')} - {format(new Date(stop.end_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                {stop.activities && stop.activities.length > 0 ? (
                  <div className="pl-11 space-y-3 mt-4">
                    {stop.activities.map(activity => (
                      <div key={activity.id} className="flex gap-4 p-3 bg-white/70 rounded-2xl ring-1 ring-black/5 hover:bg-white hover:shadow-sm transition-all">
                        <div className="mt-1 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900">{activity.title}</h4>
                            {activity.cost > 0 && (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                ${activity.cost.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-medium">
                            {activity.scheduled_at && (
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(activity.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                            {activity.duration_mins && (
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {activity.duration_mins} mins</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pl-11 text-sm text-gray-400 italic mt-2">No activities planned for this stop.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
