'use client'

import { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BudgetChart from '@/components/budget/BudgetChart'
import { BudgetSummary } from '@/types'

import { useTripBudget } from '@/hooks/useTrips'
import { useExpenses } from '@/hooks/useExpenses'

export default function TripBudgetPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: budget, isLoading: isBudgetLoading } = useTripBudget(params.id)
  const { data: expenses, isLoading: isExpensesLoading } = useExpenses(params.id)

  if (isBudgetLoading || isExpensesLoading) return <div className="p-8 text-center">Loading budget data...</div>
  if (!budget) return <div className="p-8 text-center text-red-500">Budget data not found.</div>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budget Overview</h1>
        <p className="text-gray-500">Track and manage your expenses for this trip.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Spend: ${budget.total.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetChart summary={budget} />
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses?.length ? (
            <ul className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <li key={expense.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{expense.label}</p>
                    <p className="text-sm text-gray-500 capitalize">{expense.category}</p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ${Number(expense.amount).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No expenses logged yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
