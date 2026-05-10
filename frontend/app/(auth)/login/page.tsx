'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { data: tokenData } = await api.post('/auth/login', new URLSearchParams({
        username: email,
        password: password,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      const { data: userData } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      })

      login(userData, tokenData.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative mt-12">
      {/* Floating Icon */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-[#e6f4fc] z-10">
        <User className="w-8 h-8 text-[#0ea5e9]" strokeWidth={2} />
      </div>
      
      {/* Card */}
      <div className="bg-white rounded-[24px] shadow-xl p-8 pt-14 border border-gray-100">
        <h1 className="text-[22px] font-semibold text-center text-[#2d3748] mb-8">Welcome back</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="username">
              Username
            </label>
            <input 
              id="username" 
              type="email" 
              placeholder="Username" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="password">
              Password
            </label>
            <input 
              id="password" 
              type="password" 
              placeholder="Password"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-32 mx-auto block h-11 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full font-medium text-[15px] transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Wait...' : 'Login'}
            </button>
          </div>
          
          <div className="text-center text-[13px] text-gray-500 pt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#0ea5e9] font-semibold hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
