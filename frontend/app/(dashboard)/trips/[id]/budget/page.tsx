'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import BudgetChart from '@/components/budget/BudgetChart'
import { BudgetSummary } from '@/types'

import { useTripBudget } from '@/hooks/useTrips'
import { useExpenses, useCreateExpense } from '@/hooks/useExpenses'

function AddExpenseDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false)
  const createExpense = useCreateExpense(tripId)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createExpense.mutateAsync({
      label: formData.get('label') as string,
      amount: Number(formData.get('amount')),
      category: formData.get('category') as any,
      date: formData.get('date') as string,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="w-4 h-4" />
        Add Expense
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Record a new cost for this trip.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Description</Label>
            <Input id="label" name="label" required placeholder="e.g. Train ticket" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" required placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
              <option value="transport">Transport</option>
              <option value="stay">Stay</option>
              <option value="food">Food</option>
              <option value="activity">Activity</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function TripBudgetPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: budget, isLoading: isBudgetLoading } = useTripBudget(params.id)
  const { data: expenses, isLoading: isExpensesLoading } = useExpenses(params.id)

  if (isBudgetLoading || isExpensesLoading) return <div className="p-8 text-center">Loading budget data...</div>
  if (!budget) return <div className="p-8 text-center text-red-500">Budget data not found.</div>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Overview</h1>
          <p className="text-gray-500">Track and manage your expenses for this trip.</p>
        </div>
        <AddExpenseDialog tripId={params.id} />
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
