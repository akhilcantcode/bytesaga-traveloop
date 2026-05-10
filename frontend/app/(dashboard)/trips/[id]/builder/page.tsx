'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, GripVertical, MapPin, Clock } from 'lucide-react'
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
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="w-4 h-4" />
        Add Stop
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Stop</DialogTitle>
          <DialogDescription>Search and select a destination to add to your itinerary.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>City</Label>
            <CitySearch
              onSelect={(city) => setSelectedCity(city)}
              placeholder="Search cities (e.g. Goa, Paris, Tokyo)"
            />
            {selectedCity && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Selected: {selectedCity.city_name}, {selectedCity.country}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" name="end_date" type="date" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createStop.isPending || !selectedCity}>
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
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <Plus className="w-4 h-4" />
        Add Activity
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>Plan an experience for this stop.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Visit Temple" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food</option>
              <option value="adventure">Adventure</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Estimated Cost (USD)</Label>
            <Input id="cost" name="cost" type="number" step="0.01" min="0" required placeholder="0.00" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createActivity.isPending}>
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

  if (isLoading) return <div className="p-8 text-center">Loading builder...</div>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Itinerary Builder</h1>
          <p className="text-gray-500">Manage stops and activities for your trip.</p>
        </div>
        <AddStopDialog tripId={params.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">Stops</h2>
          {stops?.map(stop => (
            <Card 
              key={stop.id} 
              className={`cursor-pointer transition-colors ${activeStop === stop.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
              onClick={() => setActiveStop(stop.id)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <GripVertical className="text-gray-400 w-5 h-5 cursor-grab" />
                <div className="flex-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${activeStop === stop.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {stop.city_name}, {stop.country}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(stop.start_date).toLocaleDateString()} - {new Date(stop.end_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {!stops?.length && (
            <div className="text-sm text-gray-500 p-4 text-center border border-dashed rounded-md">
              No stops yet. Add your first destination!
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle>Activities {activeStop ? `for ${stops?.find(s => s.id === activeStop)?.city_name}` : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              {activeStop ? (
                <ActivitiesList stopId={activeStop} />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Select a stop</h3>
                  <p className="text-sm text-gray-500">Choose a destination from the left to view and add activities.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ActivitiesList({ stopId }: { stopId: string }) {
  const { data: activities, isLoading } = useActivities(stopId)

  if (isLoading) return <div className="py-8 text-center text-gray-500">Loading activities...</div>

  return (
    <div className="space-y-4">
      {activities?.length ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="p-4 border rounded-md shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <Badge variant="secondary" className="mt-1 capitalize">{activity.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">${Number(activity.cost).toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-200 rounded-lg p-6">
          <Clock className="w-10 h-10 text-gray-300 mb-4" />
          <p className="text-sm text-gray-500 mb-4">No activities planned yet.</p>
        </div>
      )}
      <div className="pt-4">
        <AddActivityDialog stopId={stopId} />
      </div>
    </div>
  )
}
