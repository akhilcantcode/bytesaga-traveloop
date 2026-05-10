'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, StickyNote } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { useNotes, useCreateNote } from '@/hooks/useNotes'

function AddNoteDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false)
  const createNote = useCreateNote(tripId)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createNote.mutateAsync({
      content: formData.get('content') as string,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="w-4 h-4" />
        New Note
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>Jot down ideas, links, or reminders.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Note Content</Label>
            <textarea 
              id="content" 
              name="content" 
              required 
              rows={5}
              placeholder="Start typing..."
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
        <AddNoteDialog tripId={params.id} />
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
