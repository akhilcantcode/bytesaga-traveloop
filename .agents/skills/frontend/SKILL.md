---
name: frontend
description: Next.js frontend conventions for Traveloop. Use when building React components, pages, hooks, or anything in the frontend/ folder. Covers App Router, TanStack Query, Zustand, shadcn/ui, and Tailwind patterns.
---
# Skill: Frontend — Next.js 14 + Tailwind + shadcn/ui
# Agent: Frontend Agent (Agent 3)
# Read PLANNING.md first. This file extends it with frontend-specific conventions.

---

## 1. Project Setup Checklist

Before writing any component, verify these exist:
- [ ] `lib/api.ts` — Axios instance with base URL and auth interceptor
- [ ] `lib/queryKeys.ts` — All TanStack Query key constants
- [ ] `lib/utils.ts` — `cn()`, `formatCurrency()`, `formatDate()`
- [ ] `store/authStore.ts` — Zustand store with user, token, login, logout
- [ ] `store/tripStore.ts` — Zustand store with activeTrip
- [ ] `types/index.ts` — All TypeScript interfaces matching backend schemas
- [ ] `app/(dashboard)/layout.tsx` — Protected layout that redirects if no token
- [ ] `.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

---

## 2. Axios Instance Pattern

```typescript
// lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 3. TypeScript Interfaces

Define these in `types/index.ts`. Match backend Pydantic schemas exactly.

```typescript
// types/index.ts
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_url: string | null
  start_date: string   // ISO date string "YYYY-MM-DD"
  end_date: string
  is_public: boolean
  total_budget: number | null
  created_at: string
  stops?: Stop[]
}

export interface Stop {
  id: string
  trip_id: string
  city_name: string
  country: string
  order_index: number
  start_date: string
  end_date: string
  activities?: Activity[]
}

export interface Activity {
  id: string
  stop_id: string
  title: string
  description: string | null
  category: 'sightseeing' | 'food' | 'adventure' | 'transport' | 'accommodation'
  cost: number
  currency: string
  scheduled_at: string | null
  duration_mins: number | null
}

export interface Expense {
  id: string
  trip_id: string
  stop_id: string | null
  label: string
  amount: number
  category: 'transport' | 'stay' | 'food' | 'activity' | 'misc'
  currency: string
  date: string
}

export interface BudgetSummary {
  total: number
  breakdown: Record<string, number>
  by_category: Array<{ category: string; amount: number; percentage: number }>
}

export interface PackingItem {
  id: string
  trip_id: string
  label: string
  category: 'clothing' | 'documents' | 'electronics' | 'toiletries' | 'misc'
  is_packed: boolean
}

export interface TripNote {
  id: string
  trip_id: string
  stop_id: string | null
  content: string
  created_at: string
}
```

---

## 4. Zustand Store Pattern

```typescript
// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

---

## 5. TanStack Query Pattern

```typescript
// hooks/useTrips.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Trip } from '@/types'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useTrips() {
  return useQuery<Trip[]>({
    queryKey: QUERY_KEYS.trips.all,
    queryFn: async () => {
      const { data } = await api.get('/trips')
      return data
    },
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Trip>) => {
      const { data } = await api.post('/trips', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all })
    },
  })
}
```

```typescript
// lib/queryKeys.ts
export const QUERY_KEYS = {
  trips: {
    all: ['trips'] as const,
    detail: (id: string) => ['trips', id] as const,
    budget: (id: string) => ['trips', id, 'budget'] as const,
  },
  stops: {
    byTrip: (tripId: string) => ['stops', tripId] as const,
  },
  activities: {
    byStop: (stopId: string) => ['activities', stopId] as const,
  },
  packing: {
    byTrip: (tripId: string) => ['packing', tripId] as const,
  },
  notes: {
    byTrip: (tripId: string) => ['notes', tripId] as const,
  },
}
```

---

## 6. Protected Layout Pattern

```typescript
// app/(dashboard)/layout.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/layout/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token, router])

  if (!token) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
```

---

## 7. Component Structure Rules

Every component file follows this order:
1. Imports (React, Next, hooks, components, types, utils)
2. Interface definition for props
3. Component function (named, not anonymous)
4. Export default at the bottom

```typescript
// components/trips/TripCard.tsx
import Link from 'next/link'
import { Trip } from '@/types'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'

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
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg truncate">{trip.title}</h3>
        </CardHeader>
        <CardContent className="space-y-2">
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
```

---

## 8. Budget Chart Pattern (Recharts)

```typescript
// components/budget/BudgetChart.tsx
'use client'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { BudgetSummary } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3B82F6',
  stay:      '#8B5CF6',
  food:      '#F59E0B',
  activity:  '#10B981',
  misc:      '#6B7280',
}

interface BudgetChartProps {
  summary: BudgetSummary
}

function BudgetChart({ summary }: BudgetChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">By category</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={summary.by_category} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
              {summary.by_category.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? '#6B7280'} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => `$${val.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Breakdown</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summary.by_category} layout="vertical">
            <XAxis type="number" tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="category" width={80} />
            <Tooltip formatter={(val: number) => `$${val.toFixed(2)}`} />
            <Bar dataKey="amount">
              {summary.by_category.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? '#6B7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BudgetChart
```

---

## 9. Loading and Error States

Every data-fetching component must handle all three states:

```typescript
// Pattern to follow on every screen
const { data: trips, isLoading, isError } = useTrips()

if (isLoading) return <LoadingSpinner />
if (isError) return <ErrorMessage message="Failed to load trips. Please refresh." />
if (!trips?.length) return <EmptyState message="No trips yet." cta="Plan your first trip" href="/trips/new" />
```

Build shared `LoadingSpinner`, `ErrorMessage`, and `EmptyState` components in
`components/ui/` and reuse them everywhere.

---

## 10. Utility Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function getDayCount(start: string, end: string): number {
  return Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  )
}
```

---

## 11. Package Installation Commands

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir=false
cd frontend
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label badge dialog sheet tabs

npm install axios @tanstack/react-query zustand
npm install recharts lucide-react date-fns
npm install clsx tailwind-merge
npm install @dnd-kit/core @dnd-kit/sortable   # for stop reordering
```

---

## 12. Hard Rules — Never Violate

- Never use `useEffect` for data fetching — use TanStack Query
- Never hardcode `http://localhost:8000` — use `process.env.NEXT_PUBLIC_API_URL`
- Never use `any` type — define proper interfaces in `types/index.ts`
- Never put API call logic inside a component — extract to a custom hook in `hooks/`
- Never skip loading and error state handling on any screen
- Never use `<img>` directly — use Next.js `<Image>` component
- All screens must be responsive: test at 375px (mobile) and 1280px (desktop)
- shadcn/ui components in `components/ui/` are auto-generated — do not manually edit them
