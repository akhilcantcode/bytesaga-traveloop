'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { usePackingList, useTogglePackingItem } from '@/hooks/usePacking'

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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
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
