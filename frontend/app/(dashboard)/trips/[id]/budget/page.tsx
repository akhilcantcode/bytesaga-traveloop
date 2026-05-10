'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Wallet, TrendingDown, TrendingUp, CreditCard, Receipt } from 'lucide-react'
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
      <DialogTrigger render={<Button className="group relative overflow-hidden rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-300" />}>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative flex items-center gap-2">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Expense
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-emerald-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">New Transaction</DialogTitle>
          <DialogDescription className="text-slate-500">Record a new expense for this trip.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-slate-700 font-semibold">Description</Label>
            <Input id="label" name="label" required placeholder="e.g. Sushi Dinner" className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-700 font-semibold">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <Input id="amount" name="amount" type="number" step="0.01" min="0" required placeholder="0.00" className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-8 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-700 font-semibold">Date</Label>
              <Input id="date" name="date" type="date" required className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700 font-semibold">Category</Label>
            <select id="category" name="category" className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" required>
              <option value="transport">Transport</option>
              <option value="stay">Stay</option>
              <option value="food">Food</option>
              <option value="activity">Activity</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl h-11 text-slate-500 hover:text-slate-700">Cancel</Button>
            <Button type="submit" disabled={createExpense.isPending} className="rounded-xl h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              {createExpense.isPending ? 'Processing...' : 'Confirm Expense'}
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

  if (isBudgetLoading || isExpensesLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
      <p className="text-emerald-700 font-medium animate-pulse">Calculating finances...</p>
    </div>
  )
  
  if (!budget) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="font-medium">Failed to load budget data.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[300px] h-[300px] bg-teal-300/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-emerald-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>Finances</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            Budget Tracker
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-md">
            Monitor your spending and manage trip expenses with ease.
          </p>
        </div>
        <AddExpenseDialog tripId={params.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Spending Card */}
        <div className="lg:col-span-1">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-8 text-white shadow-[0_15px_40px_-10px_rgba(16,185,129,0.5)] relative overflow-hidden h-full flex flex-col justify-between">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <TrendingUp className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-12" />
            </div>
            
            <div className="relative z-10">
              <p className="text-emerald-100 font-medium uppercase tracking-wider text-sm mb-2">Total Spent</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-emerald-200">$</span>
                <span className="text-6xl font-black tracking-tighter">{budget.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-emerald-100">Daily Average</span>
                <span className="font-bold text-white">${(budget.total / (expenses?.length || 1)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-100">Top Category</span>
                <span className="font-bold text-white capitalize">{
                  Object.entries(budget.breakdown).sort((a,b) => b[1]-a[1])[0]?.[0] || 'None'
                }</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-2">
          <Card className="rounded-[2rem] border-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white/60 backdrop-blur-xl h-full flex flex-col">
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
                Spending Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center min-h-[300px]">
              {budget.total > 0 ? (
                <div className="w-full h-full max-h-[350px]">
                  <BudgetChart summary={budget} />
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No expenses logged yet. Add one to see the chart!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expenses List */}
      <div className="relative z-10 pt-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Receipt className="w-6 h-6 text-emerald-500" />
          Recent Transactions
        </h2>
        
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 md:p-8">
          {expenses?.length ? (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="group flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{expense.label}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="capitalize px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{expense.category}</span>
                        <span className="text-slate-400 text-xs">{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-800 text-xl pl-16 sm:pl-0">
                    <span className="text-slate-400 text-sm font-medium mr-1">$</span>
                    {Number(expense.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Transactions Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your ledger is perfectly clean. Start adding expenses to track your budget.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
