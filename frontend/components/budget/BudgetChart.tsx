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
            <Tooltip formatter={(val: any) => `$${Number(val).toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Breakdown</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summary.by_category} layout="vertical">
            <XAxis type="number" tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="category" width={80} />
            <Tooltip formatter={(val: any) => `$${Number(val).toFixed(2)}`} />
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
