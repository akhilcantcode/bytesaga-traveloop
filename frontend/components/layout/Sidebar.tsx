'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Map,
  LogOut,
  ShieldAlert,
  Compass,
  Wallet,
  ClipboardCheck,
  FileText,
  MapPin,
  ChevronLeft,
  Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  // Determine if we are in a specific trip context
  const pathParts = pathname.split('/').filter(Boolean)
  const isSpecificTrip = pathParts[0] === 'trips' && pathParts.length >= 2 && pathParts[1] !== 'new'
  const tripId = isSpecificTrip ? pathParts[1] : null

  // Define navigation items based on context
  const dashboardItem = { href: '/', label: 'Dashboard', icon: LayoutDashboard }

  const generalTripItems = [
    { href: '/trips', label: 'My Trips', icon: Map },
    { href: '/explore', label: 'Explore', icon: Compass },
    // { href: '/budget', label: 'Budget', icon: Wallet },
  ]

  const specificTripItems = tripId ? [
    { href: `/trips/${tripId}`, label: 'Overview', icon: MapPin, exact: true },
    { href: `/trips/${tripId}/builder`, label: 'Builder', icon: Wrench },
    { href: `/trips/${tripId}/budget`, label: 'Budget', icon: Wallet },
    { href: `/trips/${tripId}/checklist`, label: 'Checklist', icon: ClipboardCheck },
    { href: `/trips/${tripId}/notes`, label: 'Notes', icon: FileText },
  ] : []

  return (
    <aside className="w-72 bg-white/40 backdrop-blur-2xl border-r border-white/60 h-screen flex flex-col transition-all duration-500 shadow-[8px_0_32px_rgba(0,0,0,0.03)] z-10 hidden md:flex relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-sky-400/10 via-blue-400/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-tl from-indigo-400/10 via-purple-400/5 to-transparent pointer-events-none" />

      <div className="p-6 border-b border-white/50 flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/40 ring-2 ring-white/50">
          <Map className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 tracking-tighter drop-shadow-sm">
          Traveloop
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-5 space-y-6 relative z-10 scrollbar-hide">

        {/* Main Section */}
        <div>
          <div className="mb-3 px-3 text-[11px] font-extrabold text-sky-900/40 uppercase tracking-[0.2em]">
            Overview
          </div>
          <Link href={dashboardItem.href}>
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-300 group mb-2 relative overflow-hidden",
              pathname === dashboardItem.href
                ? "bg-white/90 text-sky-700 shadow-md shadow-sky-100/50 ring-1 ring-white/80 scale-[1.02]"
                : "text-slate-600 hover:bg-white/60 hover:text-sky-900 hover:shadow-sm"
            )}>
              {pathname === dashboardItem.href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-sky-400 to-blue-600 rounded-r-full shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
              )}
              <dashboardItem.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                pathname === dashboardItem.href ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500 group-hover:scale-110"
              )} />
              {dashboardItem.label}
            </div>
          </Link>
        </div>

        {/* Trips Section */}
        <div>
          <div className="mb-3 px-3 flex items-center justify-between text-[11px] font-extrabold text-sky-900/40 uppercase tracking-[0.2em]">
            <span>Trips</span>
            {isSpecificTrip && (
              <Link href="/trips" className="text-sky-500 hover:text-sky-700 flex items-center transition-colors">
                <ChevronLeft className="w-3 h-3 mr-0.5" /> Back
              </Link>
            )}
          </div>

          <div className="space-y-1.5 bg-white/30 rounded-3xl p-2 border border-white/40 shadow-inner">
            {(!isSpecificTrip ? generalTripItems : specificTripItems).map((item) => {
              const Icon = item.icon
              // For overview ('/trips/[id]'), require exact match if `exact` is true, else startsWith
              const isActive = (item as any).exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && pathname !== '/trips/new'

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[14px] font-medium transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-slate-100 text-blue-700"
                      : "text-slate-600 hover:bg-white/60 hover:text-blue-900"
                  )}>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                    )}
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300",
                      isActive ? "bg-blue-50 text-blue-600" : "bg-transparent text-slate-400 group-hover:bg-blue-50/50 group-hover:text-blue-500"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {user?.is_admin && (
          <div className="pt-4 border-t border-slate-200/50">
            <div className="mb-3 px-3 text-[11px] font-extrabold text-purple-900/40 uppercase tracking-[0.2em]">
              Admin
            </div>
            <Link href="/admin">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-300 group",
                pathname === '/admin'
                  ? "bg-purple-100/90 text-purple-800 shadow-md ring-1 ring-purple-200/50 scale-[1.02]"
                  : "text-slate-600 hover:bg-white/60 hover:text-purple-900"
              )}>
                <ShieldAlert className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  pathname === '/admin' ? "text-purple-600" : "text-purple-400/70 group-hover:text-purple-600 group-hover:scale-110"
                )} />
                Admin Panel
              </div>
            </Link>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/50 bg-white/30 backdrop-blur-xl relative z-10">
        <div
          className="flex items-center gap-3 mb-4 px-3 py-2.5 bg-white/80 rounded-2xl shadow-sm ring-1 ring-slate-100 cursor-pointer hover:bg-white hover:shadow-md transition-all duration-300 group"
          onClick={() => window.location.href = '/profile'}
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 p-[2px] shadow-sm group-hover:shadow-md transition-all">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-br from-sky-500 to-indigo-600">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
              {user?.full_name}
            </p>
            <p className="text-xs text-slate-500 truncate font-medium">
              View Profile
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 hover:ring-1 hover:ring-red-100 rounded-2xl transition-all duration-300 h-11 font-semibold"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
