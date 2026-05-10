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
