'use client'

import { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, StickyNote } from 'lucide-react'

import { useNotes } from '@/hooks/useNotes'

export default function TripNotesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { data: notes, isLoading } = useNotes(params.id)

  if (isLoading) return <div className="p-8 text-center">Loading notes...</div>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trip Notes</h1>
          <p className="text-gray-500">Keep track of important details, links, and ideas.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes?.map(note => (
          <Card key={note.id} className="bg-yellow-50 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap text-gray-800">{note.content}</p>
              <div className="mt-4 flex justify-between items-center text-xs text-yellow-600/60">
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                <StickyNote className="w-3 h-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!notes?.length && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No notes yet. Add your first idea!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
