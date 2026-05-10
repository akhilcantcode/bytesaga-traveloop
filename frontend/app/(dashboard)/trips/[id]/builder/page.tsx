'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, GripVertical, MapPin, Clock, CalendarRange, Map as MapIcon, ArrowRight, Activity } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CitySearch from '@/components/activities/CitySearch'

import { useStops, useCreateStop } from '@/hooks/useStops'
import { useActivities, useCreateActivity } from '@/hooks/useActivities'

function AddStopDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<{ city_name: string; country: string } | null>(null)
  const createStop = useCreateStop(tripId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCity) return
    const formData = new FormData(e.currentTarget)
    await createStop.mutateAsync({
      city_name: selectedCity.city_name,
      country: selectedCity.country,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      order_index: 0
    })
    setSelectedCity(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="group relative overflow-hidden rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 transition-all duration-300" />}>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative flex items-center gap-2">
          <MapPin className="w-5 h-5 group-hover:-translate-y-1 group-hover:text-blue-200 transition-all duration-300" />
          Add Destination
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-indigo-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Add a Stop</DialogTitle>
          <DialogDescription className="text-slate-500">Search and select a destination to add to your itinerary.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">City</Label>
            <CitySearch
              onSelect={(city) => setSelectedCity(city)}
              placeholder="Search cities (e.g. Goa, Paris, Tokyo)"
            />
            {selectedCity && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-xl flex items-center gap-3 border border-indigo-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900">{selectedCity.city_name}</p>
                  <p className="text-xs font-medium text-indigo-600/70">{selectedCity.country}</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-slate-700 font-semibold">Arrival</Label>
              <Input id="start_date" name="start_date" type="date" required className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-slate-700 font-semibold">Departure</Label>
              <Input id="end_date" name="end_date" type="date" required className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl h-11 text-slate-500">Cancel</Button>
            <Button type="submit" disabled={createStop.isPending || !selectedCity} className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              {createStop.isPending ? 'Adding...' : 'Add Stop'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddActivityDialog({ stopId }: { stopId: string }) {
  const [open, setOpen] = useState(false)
  const createActivity = useCreateActivity(stopId)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createActivity.mutateAsync({
      title: formData.get('title') as string,
      category: formData.get('category') as any,
      cost: Number(formData.get('cost')),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="group rounded-2xl h-12 border-dashed border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-semibold w-full transition-all duration-300" />}>
        <Plus className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform duration-300" />
        Add New Activity
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-indigo-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Add Activity</DialogTitle>
          <DialogDescription className="text-slate-500">Plan an experience for this stop.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700 font-semibold">Activity Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Louvre Museum" className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-indigo-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700 font-semibold">Category</Label>
            <select id="category" name="category" className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" required>
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food</option>
              <option value="adventure">Adventure</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-slate-700 font-semibold">Estimated Cost (USD)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <Input id="cost" name="cost" type="number" step="0.01" min="0" required placeholder="0.00" className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-8 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl h-11 text-slate-500">Cancel</Button>
            <Button type="submit" disabled={createActivity.isPending} className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              {createActivity.isPending ? 'Adding...' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ItineraryBuilderPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: stops, isLoading } = useStops(params.id)
  const [activeStop, setActiveStop] = useState<string | null>(null)

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
      <p className="text-indigo-800 font-medium animate-pulse">Building your itinerary...</p>
    </div>
  )

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Decorative abstract elements */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <MapIcon className="w-4 h-4 text-indigo-500" />
            <span>Itinerary</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            Trip Builder
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-md">
            Design your perfect journey. Add stops and plan activities for each destination.
          </p>
        </div>
        <AddStopDialog tripId={params.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Stops Timeline (Left Panel) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              Destinations
            </h2>
            
            <div className="relative">
              {stops?.length ? (
                <div className="space-y-4 relative">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[1.15rem] top-6 bottom-6 w-0.5 bg-indigo-100 rounded-full" />
                  
                  {stops.map((stop, index) => {
                    const isActive = activeStop === stop.id
                    return (
                      <div 
                        key={stop.id} 
                        className={`relative z-10 group cursor-pointer transition-all duration-300 ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                        onClick={() => setActiveStop(stop.id)}
                      >
                        <div className={`absolute -left-1 top-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white border-2 border-indigo-100 text-indigo-400 group-hover:border-indigo-300'}`}>
                          {index + 1}
                        </div>
                        <div className={`ml-12 p-4 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-white border-slate-100 shadow-sm group-hover:border-indigo-100'}`}>
                          <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {stop.city_name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <CalendarRange className="w-3.5 h-3.5" />
                            {new Date(stop.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                            <ArrowRight className="w-3 h-3 mx-0.5" /> 
                            {new Date(stop.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No stops yet.<br/>Add your first destination!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activities Panel (Right Panel) */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)] min-h-[600px] flex flex-col overflow-hidden">
            {/* dynamic header */}
            {activeStop && stops?.find(s => s.id === activeStop) ? (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none mb-3 backdrop-blur-md">
                  Active Destination
                </Badge>
                <h2 className="text-3xl font-black drop-shadow-sm">
                  {stops.find(s => s.id === activeStop)?.city_name}, {stops.find(s => s.id === activeStop)?.country}
                </h2>
                <p className="text-indigo-100 font-medium mt-1">Plan your day-to-day experiences.</p>
              </div>
            ) : (
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-500" />
                  Activities Planner
                </h2>
              </div>
            )}
            
            <div className="flex-1 p-6 md:p-8">
              {activeStop ? (
                <ActivitiesList stopId={activeStop} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-xl border border-indigo-50">
                      <MapIcon className="w-10 h-10 text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Destination</h3>
                  <p className="text-slate-500 max-w-sm">
                    Choose a stop from the timeline on the left to view and plan your activities for that location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivitiesList({ stopId }: { stopId: string }) {
  const { data: activities, isLoading } = useActivities(stopId)

  if (isLoading) return (
    <div className="py-12 flex justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      {activities?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {activity.category}
                </Badge>
                <div className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-sm">
                  ${Number(activity.cost).toFixed(2)}
                </div>
              </div>
              <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-700 transition-colors">
                {activity.title}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-6">
          <Clock className="w-10 h-10 text-slate-300 mb-3" />
          <p className="font-medium text-slate-600">No activities planned yet.</p>
          <p className="text-sm text-slate-400">Time to fill up your itinerary!</p>
        </div>
      )}
      
      <div className="pt-2">
        <AddActivityDialog stopId={stopId} />
      </div>
    </div>
  )
}
