// frontend/app/dashboard/page.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/utils/supabase-auth-context'

export default function Dashboard() {
  const router = useRouter()
  const { session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  if (!session) return null // or loading spinner

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  )
}
