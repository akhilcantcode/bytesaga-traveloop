'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, Circle, CheckCircle2, ListTodo, PackageCheck, BaggageClaim } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { usePackingList, useTogglePackingItem, useCreatePackingItem } from '@/hooks/usePacking'

function AddPackingItemDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false)
  const createItem = useCreatePackingItem(tripId)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createItem.mutateAsync({
      label: formData.get('label') as string,
      category: formData.get('category') as any,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="group relative overflow-hidden rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-6 shadow-[0_8px_20px_-4px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 transition-all duration-300" />}>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative flex items-center gap-2">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Item
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-amber-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Add Packing Item</DialogTitle>
          <DialogDescription className="text-slate-500">What do you need to bring for this trip?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-slate-700 font-semibold">Item Name</Label>
            <Input id="label" name="label" required placeholder="e.g. Passport, Sunscreen" className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-amber-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700 font-semibold">Category</Label>
            <select id="category" name="category" className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" required>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="toiletries">Toiletries</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl h-11 text-slate-500">Cancel</Button>
            <Button type="submit" disabled={createItem.isPending} className="rounded-xl h-11 px-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              {createItem.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function PackingChecklistPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: items, isLoading } = usePackingList(params.id)
  const toggleItemMutation = useTogglePackingItem(params.id)

  const toggleItem = (id: string) => {
    toggleItemMutation.mutate(id)
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
      <p className="text-amber-700 font-medium animate-pulse">Loading your checklist...</p>
    </div>
  )

  const packedCount = items?.filter(i => i.is_packed).length || 0
  const totalCount = items?.length || 0
  const percentage = totalCount ? Math.round((packedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10 relative">
      {/* Decorative blobs */}
      <div className="absolute top-[0%] right-[-10%] w-[350px] h-[350px] bg-amber-300/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-15%] w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 border border-amber-200/50 text-amber-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <BaggageClaim className="w-4 h-4 text-amber-500" />
            <span>Preparation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            Packing Checklist
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-md">
            Don't forget the essentials. Keep track of what you need to bring.
          </p>
        </div>
        <AddPackingItemDialog tripId={params.id} />
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-6 md:p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <PackageCheck className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-3">
              <span className="font-bold text-slate-700 text-lg">Packing Progress</span>
              <span className="font-black text-amber-600 text-2xl">{percentage}%</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 bg-[length:10px_10px] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2)_100%)] animate-[shimmer_1s_linear_infinite]" />
              </div>
            </div>
          </div>
          <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 min-w-[150px] text-center">
            <span className="block text-amber-800 font-black text-3xl mb-1">{packedCount} <span className="text-amber-400 text-xl font-medium">/ {totalCount}</span></span>
            <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Items Packed</span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 md:p-8 relative z-10">
        {items?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                  item.is_packed 
                    ? "bg-slate-50 border-slate-200 shadow-none hover:bg-slate-100" 
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    item.is_packed ? "bg-emerald-100 text-emerald-500 scale-110" : "bg-slate-100 text-slate-300 group-hover:border-amber-400 border-2 border-transparent"
                  )}>
                    {item.is_packed ? <Check className="w-5 h-5" /> : null}
                  </div>
                </div>
                
                <div className="relative z-10 flex-1">
                  <p className={cn(
                    "text-lg font-bold transition-all duration-300",
                    item.is_packed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800 group-hover:text-amber-700"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-slate-400 capitalize">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ListTodo className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Your Bag is Empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Start adding essential items to your packing list so you don't leave anything behind.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
