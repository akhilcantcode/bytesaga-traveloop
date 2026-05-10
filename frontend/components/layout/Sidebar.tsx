'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Map,
  User,
  LogOut,
  ShieldAlert,
  Compass,
  Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trips', label: 'My Trips', icon: Map },
    { href: '/explore', label: 'Explore', icon: Compass },
    // { href: '/budget', label: 'Budget', icon: Wallet },
  ]

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/50 h-screen flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
      <div className="p-6 border-b border-white/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Map className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600 tracking-tight">
          Traveloop
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="mb-4 px-2 text-[10px] font-bold text-sky-600/70 uppercase tracking-widest">
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group mb-1.5 relative overflow-hidden",
                isActive
                  ? "bg-white/80 text-sky-700 shadow-sm ring-1 ring-white/50"
                  : "text-gray-600 hover:bg-white/50 hover:text-sky-900"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-r-full" />
                )}
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive ? "text-sky-600 scale-110" : "text-sky-400/70 group-hover:text-sky-600 group-hover:scale-110"
                )} />
                {item.label}
              </div>
            </Link>
          )
        })}

        {user?.is_admin && (
          <>
            <div className="mt-8 mb-4 px-2 text-[10px] font-bold text-purple-600/70 uppercase tracking-widest">
              Admin
            </div>
            <Link href="/admin">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
                pathname === '/admin'
                  ? "bg-purple-100/80 text-purple-700 shadow-sm ring-1 ring-purple-200/50"
                  : "text-gray-600 hover:bg-white/50 hover:text-purple-900"
              )}>
                <ShieldAlert className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  pathname === '/admin' ? "text-purple-600 scale-110" : "text-purple-400/70 group-hover:text-purple-600 group-hover:scale-110"
                )} />
                Admin Panel
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/50 bg-white/20">
        <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-white/60 rounded-2xl shadow-sm ring-1 ring-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors" onClick={() => window.location.href = '/profile'}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-sky-600/80 truncate font-medium">
              View Profile
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
