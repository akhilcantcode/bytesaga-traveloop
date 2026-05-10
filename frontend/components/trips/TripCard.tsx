import Link from 'next/link'
import { Trip } from '@/types'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

interface TripCardProps {
  trip: Trip
}

function TripCard({ trip }: TripCardProps) {
  const dayCount = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime())
    / (1000 * 60 * 60 * 24)
  )

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg truncate">{trip.title}</h3>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{dayCount} days</Badge>
            {trip.total_budget && (
              <span className="text-sm font-medium text-green-600">
                ${trip.total_budget.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default TripCard
