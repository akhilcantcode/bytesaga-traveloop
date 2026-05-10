'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { User } from '@/types'
import { useMutation } from '@tanstack/react-query'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [message, setMessage] = useState('')

  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.put<User>('/auth/me', { full_name: newName })
      return data
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    },
    onError: () => {
      setMessage('Failed to update profile.')
      setTimeout(() => setMessage(''), 3000)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fullName.trim() && fullName !== user?.full_name) {
      updateMutation.mutate(fullName)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email} 
                disabled 
                className="bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending || fullName === user.full_name || !fullName.trim()}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              {message && (
                <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
