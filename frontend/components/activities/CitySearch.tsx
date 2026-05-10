'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface City {
  id: string
  name: string
  country: string
  cost_index: number
  popularity: number
}

interface CitySearchProps {
  onSelect: (city: { city_name: string; country: string }) => void
  placeholder?: string
}

const COST_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: '$', color: 'text-green-600' },
  2: { label: '$$', color: 'text-green-500' },
  3: { label: '$$$', color: 'text-yellow-500' },
  4: { label: '$$$$', color: 'text-orange-500' },
  5: { label: '$$$$$', color: 'text-red-500' },
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function CitySearch({ onSelect, placeholder = 'Search cities...' }: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ['cities', 'search', debouncedQuery],
    queryFn: async () => {
      const { data } = await api.get(`/cities/search?q=${encodeURIComponent(debouncedQuery)}`)
      return data
    },
    enabled: open,
  })

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (city: City) => {
    onSelect({ city_name: city.name, country: city.country })
    setQuery(`${city.name}, ${city.country}`)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
        />
      </div>

      {open && cities.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {cities.map((city) => {
            const cost = COST_LABELS[city.cost_index] ?? COST_LABELS[2]
            return (
              <button
                key={city.id}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                onMouseDown={(e) => {
                  e.preventDefault() // keep focus in input
                  handleSelect(city)
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{city.name}</p>
                  <p className="text-xs text-gray-500">{city.country}</p>
                </div>
                <span className={`text-xs font-semibold ${cost.color}`}>{cost.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {open && debouncedQuery.length > 0 && cities.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
          No cities found for "{debouncedQuery}"
        </div>
      )}
    </div>
  )
}
