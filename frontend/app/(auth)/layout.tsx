import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f8fc] to-[#c9eafd] px-4 py-4 ${inter.className}`}>
      {children}
    </div>
  )
}
