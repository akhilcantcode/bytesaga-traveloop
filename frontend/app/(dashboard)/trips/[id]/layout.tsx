'use client'

import { use } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', href: '' },
  { label: 'Builder', href: '/builder' },
  { label: 'Budget', href: '/budget' },
  { label: 'Checklist', href: '/checklist' },
  { label: 'Notes', href: '/notes' },
]

export default function TripDetailLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const pathname = usePathname()
  const baseUrl = `/trips/${params.id}`

  return (
    <div className="space-y-6">
      {/* Trip Sub-navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {navItems.map((item) => {
            const itemUrl = `${baseUrl}${item.href}`
            // Exact match for overview, prefix match for others
            const isActive = item.href === '' 
              ? pathname === itemUrl 
              : pathname.startsWith(itemUrl)

            return (
              <Link
                key={item.label}
                href={itemUrl}
                className={cn(
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Child Pages */}
      <div>{props.children}</div>
    </div>
  )
}
