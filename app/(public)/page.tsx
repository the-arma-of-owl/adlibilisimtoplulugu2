'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Timeline from '@/components/Timeline'
import { useEvents } from '@/lib/hooks/useEvents'

export default function HomePage() {
  const router = useRouter()
  const { events, loading, error } = useEvents()
  const [aboutText, setAboutText] = useState<string>('')

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('/api/settings?key=about_text')
        const result = await response.json()
        if (result.data?.value) {
          setAboutText(result.data.value)
        } else {
          setAboutText('Adli Bilişim Topluluğu olarak yıl boyunca çeşitli etkinlikler düzenliyoruz.')
        }
      } catch (err) {
        console.error('Error fetching about text:', err)
        setAboutText('Adli Bilişim Topluluğu olarak yıl boyunca çeşitli etkinlikler düzenliyoruz.')
      }
    }
    fetchAbout()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Timeline Section */}
        <section className="mb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 max-w-2xl mx-auto shadow-lg">
                <p className="text-yellow-800 dark:text-yellow-400 font-semibold mb-2">⚠️ Yapılandırma Gerekli</p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-4">{error}</p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                  Detaylı kurulum talimatları için README.md dosyasına bakın.
                </p>
              </div>
            </div>
          ) : (
            <Timeline events={events} />
          )}
        </section>

        {/* Event Entry Button */}
        <section className="mb-16 text-center">
          <button
            onClick={() => router.push('/enter')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:via-indigo-400 dark:hover:to-purple-400"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Etkinlik Giriş
            </span>
          </button>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-6 text-center">
            Hakkımızda
          </h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center">
              {aboutText || 'Adli Bilişim Topluluğu olarak yıl boyunca çeşitli etkinlikler düzenliyoruz.'}
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-16 border-t border-gray-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Adli Bilişim Topluluğu
          </p>
        </div>
      </footer>
    </div>
  )
}

