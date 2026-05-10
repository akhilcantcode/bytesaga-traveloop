'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, GripVertical, MapPin } from 'lucide-react'

import { useStops } from '@/hooks/useStops'

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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Stop
        </Button>
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
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No activities planned yet</h3>
                <p className="text-sm text-gray-500 mb-4">Start adding places to visit, restaurants, and more.</p>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
