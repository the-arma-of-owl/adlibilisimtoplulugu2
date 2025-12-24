'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function EnterPage() {
  const router = useRouter()
  const [entryCode, setEntryCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/participants/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry_code: entryCode.toUpperCase() }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Geçersiz giriş kodu')
        setLoading(false)
        return
      }

      // Redirect to event page with entry code
      router.push(`/event/${entryCode.toUpperCase()}`)
    } catch (err: any) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-gray-900/50 p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6 text-center">
            Etkinlik Giriş
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Etkinlik giriş kodunuzu aşağıya giriniz
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="entry-code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Giriş Kodu
              </label>
              <input
                id="entry-code"
                type="text"
                value={entryCode}
                onChange={(e) => {
                  // Format as XXX-XXX-XXX-XXX
                  let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  if (value.length > 12) value = value.substring(0, 12)
                  // Add dashes
                  let formatted = ''
                  for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 3 === 0) formatted += '-'
                    formatted += value[i]
                  }
                  setEntryCode(formatted)
                  setError(null)
                }}
                placeholder="FDG-SGS-DRH-GSE"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-center text-lg font-mono tracking-widest"
                maxLength={15}
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Format: XXX-XXX-XXX-XXX
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || entryCode.length < 15}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Kontrol ediliyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              ← Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

