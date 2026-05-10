'use client'

import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, StickyNote, FileText, Pin } from 'lucide-react'
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
      <DialogTrigger render={<Button className="group relative overflow-hidden rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold h-12 px-6 shadow-[0_8px_20px_-4px_rgba(250,204,21,0.5)] hover:-translate-y-0.5 transition-all duration-300" />}>
        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative flex items-center gap-2">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          New Note
        </span>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-yellow-100 shadow-2xl bg-gradient-to-br from-yellow-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">New Note</DialogTitle>
          <DialogDescription className="text-slate-500">Jot down ideas, links, or reminders.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-700 font-semibold">Note Content</Label>
            <textarea 
              id="content" 
              name="content" 
              required 
              rows={6}
              placeholder="Start typing your brilliant idea..."
              className="flex w-full rounded-2xl border border-yellow-200 bg-white/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl h-11 text-slate-500">Cancel</Button>
            <Button type="submit" disabled={createNote.isPending} className="rounded-xl h-11 px-8 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold shadow-md">
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

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-400 rounded-full animate-spin shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
      <p className="text-yellow-700 font-medium animate-pulse">Fetching your notes...</p>
    </div>
  )

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Decorative blobs */}
      <div className="absolute top-[0%] left-[-10%] w-[400px] h-[400px] bg-yellow-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-orange-200/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100/50 border border-yellow-200/50 text-yellow-700 text-sm font-semibold mb-2 shadow-sm backdrop-blur-sm">
            <StickyNote className="w-4 h-4 text-yellow-500" />
            <span>Ideas & Reminders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            Trip Notes
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-md">
            Keep track of important details, reservation links, and spontaneous ideas.
          </p>
        </div>
        <AddNoteDialog tripId={params.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
        {notes?.map((note, index) => {
          // Slight random rotation for a natural sticky note feel
          const rotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-0']
          const rotation = rotations[index % rotations.length]
          
          return (
            <div 
              key={note.id} 
              className={`group relative ${rotation} transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-10`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 opacity-80 group-hover:opacity-100 transition-opacity">
                <Pin className="w-6 h-6 text-red-400 fill-red-200 drop-shadow-sm" />
              </div>
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-0 shadow-[2px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[5px_15px_30px_rgba(0,0,0,0.1)] transition-shadow duration-300 h-full overflow-hidden rounded-bl-3xl">
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-yellow-200 to-transparent rounded-tr-xl shadow-[-2px_2px_4px_rgba(0,0,0,0.05)] opacity-50" />
                <CardContent className="p-6 pt-8 h-full flex flex-col">
                  <p className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed flex-1">{note.content}</p>
                  <div className="mt-6 flex justify-between items-center text-xs font-semibold text-yellow-600/50 uppercase tracking-wider">
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    <FileText className="w-4 h-4 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {!notes?.length && (
        <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-12 text-center mt-8">
          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50" />
            <StickyNote className="w-10 h-10 text-yellow-400 relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Notes Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Got an idea for the trip? A restaurant to try? A booking reference? Jot it down here!
          </p>
        </div>
      )}
    </div>
  )
}
