'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CountdownTimer from '@/components/CountdownTimer'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { formatDate } from '@/lib/utils/time'

interface Participant {
  id: string
  name: string
  phone: string
  entry_code: string
  qr_token: string
  event_id: string
  events: {
    id: string
    title: string
    date: string
  }
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const code = params?.code as string
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [whatsappContact, setWhatsappContact] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch participant data
        const response = await fetch(`/api/participants/${code}`)
        const result = await response.json()

        if (!response.ok) {
          setError(result.error || 'Katılımcı bulunamadı')
          setLoading(false)
          return
        }

        setParticipant(result.data)

        // Fetch WhatsApp contact
        const settingsResponse = await fetch('/api/settings?key=whatsapp_contact')
        const settingsResult = await settingsResponse.json()
        if (settingsResult.data?.value) {
          setWhatsappContact(settingsResult.data.value)
        }
      } catch (err: any) {
        setError('Veriler yüklenirken bir hata oluştu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchData()
    }
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
        </div>
      </div>
    )
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
        <Header />
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-gray-900/50 p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Hata</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Katılımcı bulunamadı'}</p>
            <button
              onClick={() => router.push('/enter')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Tekrar Dene
            </button>
          </div>
        </main>
      </div>
    )
  }

  const whatsappUrl = whatsappContact
    ? `https://wa.me/${whatsappContact.replace(/[^0-9]/g, '')}`
    : '#'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Greeting */}
        <section className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Merhaba {participant.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{participant.events.title}</p>
        </section>

        {/* Event Date */}
        <section className="mb-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg font-semibold">
              {formatDate(participant.events.date)}
            </span>
          </div>
        </section>

        {/* Countdown Timer */}
        <section className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 border border-blue-200/50 dark:border-blue-800/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Etkinliğe Kalan Süre
          </h2>
          <CountdownTimer targetDate={participant.events.date} />
        </section>

        {/* QR Code */}
        <section className="mb-12">
          <QRCodeDisplay
            value={participant.qr_token}
            participantName={participant.name}
          />
        </section>

        {/* WhatsApp Contact */}
        {whatsappContact && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 dark:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="font-semibold">İletişime geçin</span>
            </a>
          </div>
        )}
      </main>
    </div>
  )
}

