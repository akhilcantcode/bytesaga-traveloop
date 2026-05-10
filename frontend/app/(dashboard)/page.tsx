'use client'

import { Trip } from '@/types'
import TripCard from '@/components/trips/TripCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Plus, Compass, Wallet, MapPin, Calendar,
  Heart, ArrowRight, PlaneTakeoff, Bell, Search,
  Globe2, TrendingUp, CreditCard
} from 'lucide-react'
import { useTrips } from '@/hooks/useTrips'
import { useAuthStore } from '@/store/authStore'
import { useDashboardStats, useDashboardDestinations, useDashboardSuggestedTrips } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { data: trips, isLoading: tripsLoading, isError: tripsError } = useTrips()
  const { user } = useAuthStore()

  const { data: stats } = useDashboardStats()
  const { data: destinations } = useDashboardDestinations()
  const { data: suggestedTrips } = useDashboardSuggestedTrips()

  if (tripsLoading) return <div className="p-8 text-center text-sky-600 font-medium">Loading your travel dashboard...</div>
  if (tripsError) return <div className="p-8 text-center text-red-500">Failed to load trips.</div>

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10">

      {/* MAIN CENTER CONTENT */}
      <div className="flex-1 flex flex-col gap-8">

        {/* Top Header / Search */}
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-sm ring-1 ring-white/60">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600/60" />
            <input
              type="text"
              placeholder="Search destinations, trips, or activities..."
              className="w-full pl-10 pr-4 py-2 bg-white/60 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white/60 hover:bg-white rounded-xl text-sky-700 transition-colors shadow-sm ring-1 ring-white/60">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[280px] flex items-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
              alt="Travel Hero"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 via-blue-900/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-12 max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4 border border-white/30">
              <Globe2 className="w-4 h-4" />
              <span>Discover the unexpected</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
              Explore the World
            </h1>
            <p className="text-sky-100/90 text-lg md:text-xl mb-8 max-w-lg drop-shadow-sm font-medium">
              Your next great adventure is calling. Plan, budget, and organize your trips seamlessly with Traveloop.
            </p>
            <Link href="/trips/new">
              <Button className="bg-white text-sky-700 hover:bg-sky-50 rounded-xl px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2 border-0">
                <PlaneTakeoff className="w-5 h-5" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Explore Destinations', icon: Compass, color: 'text-indigo-600', bg: 'bg-indigo-100', href: '/explore' },
            // { title: 'Budget Planner', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/budget' },
            { title: 'Create Trip', icon: Plus, color: 'text-sky-600', bg: 'bg-sky-100', href: '/trips/new' },
          ].map((action, i) => (
            <Link href={action.href} key={i}>
              <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm ring-1 ring-white/60 cursor-pointer hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg}`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="font-semibold text-gray-800">{action.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trending Destinations</h2>
            <button className="text-sky-600 font-medium text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(destinations || []).map((dest, i) => (
              <Link href={`/explore/destinations/${dest.id}`} key={i}>
                <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer shadow-sm ring-1 ring-black/5">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <span className="font-bold text-lg">{dest.name}</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trips Section */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Trips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips?.length ? (
              trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="col-span-full p-10 text-center bg-white/40 backdrop-blur-md border-2 border-dashed border-sky-300 rounded-3xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
                <p className="text-sky-700/80 mb-6 max-w-sm">You haven&apos;t planned any adventures yet. Start exploring the world with Traveloop!</p>
                <Link href="/trips/new">
                  <Button className="bg-sky-600 hover:bg-sky-700 rounded-xl px-6 py-5 shadow-lg">
                    Plan your first trip
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-full xl:w-[320px] flex flex-col gap-6">

        {/* User Profile Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-sky-400 to-indigo-500 opacity-20" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white mb-4 mt-4">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.full_name || 'Traveler'}</h2>
          <p className="text-sm text-sky-600 font-medium mb-6">{user?.email}</p>

          <div className="w-full grid grid-cols-2 gap-2 text-left">
            <div className="bg-white/70 rounded-2xl p-3 ring-1 ring-black/5">
              <p className="text-xs text-gray-500 font-medium mb-1">Trips</p>
              <p className="text-xl font-bold text-sky-700">{stats?.total_trips || trips?.length || 0}</p>
            </div>
            <div className="bg-white/70 rounded-2xl p-3 ring-1 ring-black/5">
              <p className="text-xs text-gray-500 font-medium mb-1">Countries</p>
              <p className="text-xl font-bold text-indigo-700">{stats?.total_countries || 0}</p>
            </div>
          </div>
        </div>

        {/* Budget Highlights */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            Budget Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/70 rounded-2xl ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Spent</p>
                  <p className="font-bold text-gray-900">{formatCurrency(stats?.total_spent)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/70 rounded-2xl ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Upcoming Budget</p>
                  <p className="font-bold text-gray-900">{formatCurrency(stats?.upcoming_budget)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Inspiration */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-white/60">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Suggested Trips
          </h3>
          <div className="space-y-4">
            {(suggestedTrips || []).map((deal, i) => (
              <Link href={`/explore/trips/${deal.id}`} key={i}>
                <div className="flex gap-3 group cursor-pointer mt-4">
                  <img src={deal.image} alt={deal.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-sky-600 transition-colors">{deal.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 font-medium">{deal.duration}</p>
                      <p className="text-xs font-bold text-indigo-600">{deal.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

