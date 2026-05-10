'use client'

import { useCity } from '@/hooks/useCities'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, TrendingUp, DollarSign, PlaneTakeoff, Heart } from 'lucide-react'
import Link from 'next/link'

export default function DestinationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const cityId = params.id as string
  
  const { data: city, isLoading, isError } = useCity(cityId)

  if (isLoading) {
    return <div className="p-10 text-center text-sky-600 font-medium">Loading destination details...</div>
  }

  if (isError || !city) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Destination not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  // Cost Index Formatting
  const getCostLevel = (index: number) => {
    if (index < 40) return { label: 'Budget Friendly', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    if (index < 70) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-100' }
    return { label: 'Luxury', color: 'text-rose-600', bg: 'bg-rose-100' }
  }

  const cost = getCostLevel(city.cost_index)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sky-700 font-medium hover:text-sky-900 transition-colors self-start bg-white/40 px-3 py-1.5 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[350px] flex items-end">
        <div className="absolute inset-0">
          <img 
            src={`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop`} 
            alt={city.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
              {city.name}
            </h1>
            <div className="flex items-center gap-2 text-sky-100/90 text-lg md:text-xl drop-shadow-sm font-medium">
              <MapPin className="w-5 h-5" />
              <span>{city.country}</span>
            </div>
          </div>
          
          <Link href={`/trips/new?city=${encodeURIComponent(city.name)}`}>
            <Button className="bg-white text-sky-700 hover:bg-sky-50 rounded-xl px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2 border-0">
              <PlaneTakeoff className="w-5 h-5" />
              Plan a Trip Here
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Region</p>
            <p className="text-xl font-bold text-gray-900">{city.country}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cost.bg} ${cost.color}`}>
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cost Index ({city.cost_index}/100)</p>
            <p className="text-xl font-bold text-gray-900">{cost.label}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Popularity Score</p>
            <p className="text-xl font-bold text-gray-900">{city.popularity}/100</p>
          </div>
        </div>

      </div>

      {/* Description / Placeholder */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-sm ring-1 ring-white/60 mt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {city.name}</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-6">
          {city.name} is one of the most vibrant and exciting destinations in {city.country}. 
          Whether you're looking for cultural experiences, world-class dining, or breathtaking scenery, 
          {city.name} has something to offer for every type of traveler. With a cost index of {city.cost_index}, 
          it caters perfectly to those looking for a {cost.label.toLowerCase()} experience.
        </p>
        <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-4">
          <div className="bg-sky-200 p-2 rounded-full text-sky-700 mt-1">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sky-900">Why travelers love it</h3>
            <p className="text-sky-800/80 mt-1">
              Consistently highly rated by the Traveloop community with a popularity score of {city.popularity}. 
              Start building your itinerary to discover the best spots!
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
