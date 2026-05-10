'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => { setIsHydrated(true) }, [])

  useEffect(() => {
    if (isHydrated && token) router.replace('/dashboard')
  }, [token, isHydrated, router])

  // Show nothing while hydrating or if already logged in (redirect pending)
  if (!isHydrated || token) return null

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f8fc] to-[#c9eafd] px-4 py-4 ${inter.className}`}>
      {children}
    </div>
  )
}
