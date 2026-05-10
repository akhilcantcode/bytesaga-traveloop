'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Traveloop</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/trips" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                My Trips
              </Link>
              {user?.is_admin && (
                <Link href="/admin" className="border-transparent text-purple-600 hover:border-purple-300 hover:text-purple-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              {user?.full_name}
            </Link>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
