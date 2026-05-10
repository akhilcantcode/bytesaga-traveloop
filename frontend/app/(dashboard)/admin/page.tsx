'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useAdminStats, useAdminPopularCities, useAdminUsers } from '@/hooks/useAdmin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Users, Briefcase, DollarSign, Activity } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: popularCities, isLoading: citiesLoading } = useAdminPopularCities()
  const { data: usersList, isLoading: usersLoading } = useAdminUsers()

  useEffect(() => {
    if (user && !user.is_admin) {
      router.replace('/')
    }
  }, [user, router])

  if (!user?.is_admin) return null
  if (statsLoading || citiesLoading || usersLoading) return <div className="p-8 text-center text-gray-500">Loading admin data...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor platform usage and engagement.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trips Created</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_trips || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses Tracked</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_expenses?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Most Popular Cities
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {popularCities?.cities && popularCities.cities.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularCities.cities} margin={{ top: 5, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="city_name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }} 
                    angle={-45} 
                    textAnchor="end" 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Times Added" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Not enough data to display.</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersList?.map((u) => (
                  <tr key={u.id} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      {u.is_admin ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Admin</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!usersList?.length && (
              <div className="p-8 text-center text-gray-500">No users found.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
