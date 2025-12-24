'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CountdownTimer from '@/components/CountdownTimer'
import Image from 'next/image'
import { formatDate } from '@/lib/utils/time'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  location_url: string | null
  image_url: string | null
  gallery_images: string[] | null
  is_active: boolean
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        const result = await response.json()

        if (!response.ok) {
          setError(result.error || 'Etkinlik bulunamadı')
          setLoading(false)
          return
        }

        const eventData = result.data
        // Parse gallery_images if it's a JSON string
        if (eventData.gallery_images && typeof eventData.gallery_images === 'string') {
          try {
            eventData.gallery_images = JSON.parse(eventData.gallery_images)
          } catch (e) {
            eventData.gallery_images = []
          }
        }
        setEvent(eventData)
      } catch (err: any) {
        setError('Veriler yüklenirken bir hata oluştu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

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

  if (error || !event) {
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
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Etkinlik bulunamadı'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </main>
      </div>
    )
  }

  const handleLocationClick = () => {
    if (event.location_url) {
      window.open(event.location_url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Hero Section with Image */}
        <section className="relative mb-8 rounded-2xl overflow-hidden shadow-xl">
          {event.image_url ? (
            <div className="relative h-64 md:h-96">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
                {event.is_active && (
                  <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full mb-4">
                    Aktif Etkinlik
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 h-64 md:h-96 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                {event.title}
              </h1>
            </div>
          )}
        </section>

        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            {event.description && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Hakkında
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

            {/* Countdown Timer */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 border border-blue-200/50 dark:border-blue-800/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Etkinliğe Kalan Süre
              </h2>
              <CountdownTimer targetDate={event.date} />
            </div>

            {/* Gallery Section */}
            {event.gallery_images && event.gallery_images.length > 0 && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  Galeri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.gallery_images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => {
                        // Open image in fullscreen/modal (simple implementation)
                        window.open(imageUrl, '_blank')
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${event.title} - Görsel ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date & Location */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Detaylar
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
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
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tarih ve Saat</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Konum</p>
                      {event.location_url ? (
                        <button
                          onClick={handleLocationClick}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-2 group"
                        >
                          <span>{event.location}</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-semibold">
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/enter')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Etkinliğe Katıl
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

