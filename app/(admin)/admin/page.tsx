'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Stats {
  totalEvents: number
  totalParticipants: number
  enteredParticipants: number
  pendingParticipants: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalParticipants: 0,
    enteredParticipants: 0,
    pendingParticipants: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push('/admin/login')
        return
      }

      setUser(currentUser)

      try {
        // Fetch stats
        const [eventsRes, participantsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/admin/participants'),
        ])

        const eventsData = await eventsRes.json()
        const participantsData = await participantsRes.json()

        const participants = participantsData.data || []
        const entered = participants.filter((p: any) => p.has_entered).length

        setStats({
          totalEvents: eventsData.data?.length || 0,
          totalParticipants: participants.length,
          enteredParticipants: entered,
          pendingParticipants: participants.length - entered,
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Paneli</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8 flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Etkinlikler
          </Link>
          <Link
            href="/admin/scanner"
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            QR Okuyucu
          </Link>
          <Link
            href="/admin/lottery"
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Kura Çekme
          </Link>
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Toplam Etkinlik</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalEvents}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Toplam Katılımcı</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalParticipants}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-600 dark:text-green-400 mb-2">Giriş Yapan</div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-300">
              {stats.enteredParticipants}
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">Bekleyen</div>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-300">
              {stats.pendingParticipants}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/events"
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
            >
              Yeni Etkinlik Ekle
            </Link>
          <Link
            href="/admin/scanner"
            className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
          >
            QR Kod Okumayı Başlat
          </Link>
          <Link
            href="/admin/lottery"
            className="px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-400 transition-colors"
          >
            Kura Çekme
          </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

