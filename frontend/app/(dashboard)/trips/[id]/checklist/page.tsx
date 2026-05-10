'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, Circle } from 'lucide-react'
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
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="w-4 h-4" />
        Add Item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Packing Item</DialogTitle>
          <DialogDescription>What do you need to bring?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Item Name</Label>
            <Input id="label" name="label" required placeholder="e.g. Passport" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="toiletries">Toiletries</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createItem.isPending}>
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

  if (isLoading) return <div className="p-8 text-center">Loading packing list...</div>

  const packedCount = items?.filter(i => i.is_packed).length || 0
  const totalCount = items?.length || 0

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packing Checklist</h1>
          <p className="text-gray-500">
            {packedCount} of {totalCount} items packed (
            {totalCount ? Math.round((packedCount / totalCount) * 100) : 0}%)
          </p>
        </div>
        <AddPackingItemDialog tripId={params.id} />
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {items?.map((item) => (
              <li 
                key={item.id} 
                className={cn(
                  "flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors",
                  item.is_packed ? "bg-gray-50/50" : ""
                )}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex-shrink-0">
                  {item.is_packed ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-lg font-medium",
                    item.is_packed ? "text-gray-400 line-through" : "text-gray-900"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                </div>
              </li>
            ))}
          </ul>
          {!items?.length && (
            <div className="p-8 text-center text-gray-500">
              No items in your packing list yet. Add some!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
