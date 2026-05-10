'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { Camera } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      // 1. Register
      await api.post('/auth/register', {
        email,
        password,
        full_name: `${firstName} ${lastName}`.trim() || 'New User'
      })

      // 2. Login
      const { data: tokenData } = await api.post('/auth/login', new URLSearchParams({
        username: email,
        password,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      // 3. Get Me
      const { data: userData } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      })

      login(userData, tokenData.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[600px] relative mt-10">
      {/* Floating Icon */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm border-2 border-[#e6f4fc] z-10 text-[#0ea5e9]">
        <Camera className="w-4 h-4 mb-0.5" strokeWidth={2} />
        <span className="text-[9px] font-bold">Photo</span>
      </div>
      
      {/* Card */}
      <div className="bg-white rounded-[24px] shadow-xl p-8 pt-10 border border-gray-100">
        <h1 className="text-[20px] font-semibold text-center text-[#2d3748] mb-5">Create your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="firstName">
                First Name
              </label>
              <input 
                id="firstName" 
                type="text" 
                placeholder="First Name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="lastName">
                Last Name
              </label>
              <input 
                id="lastName" 
                type="text" 
                placeholder="Last Name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="email">
                Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="phone">
                Phone Number
              </label>
              <input 
                id="phone" 
                type="tel" 
                placeholder="+1 555 123 4567" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="city">
                City
              </label>
              <input 
                id="city" 
                type="text" 
                placeholder="City" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="country">
                Country
              </label>
              <input 
                id="country" 
                type="text" 
                placeholder="Country" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>
          {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="password">
                Password
              </label>
              <input 
                id="password" 
                type="password" 
                placeholder="Min. 8 characters" 
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568] px-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input 
                id="confirmPassword" 
                type="password" 
                placeholder="Repeat password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[14px] placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-40 mx-auto block h-10 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full font-medium text-[14px] transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Wait...' : 'Register Users'}
            </button>
          </div>
          
          <div className="text-center text-[12px] text-gray-500 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0ea5e9] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
