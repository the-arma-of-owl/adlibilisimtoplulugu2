'use client'

import { formatDate } from '@/lib/utils/time'
import { useRouter } from 'next/navigation'

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

interface EventCardProps {
  event: Event
  isActive: boolean
  distance: number
  onClick?: () => void
}

export default function EventCard({ event, isActive, onClick }: EventCardProps) {
  const router = useRouter()

  const handleLocationClick = (e: React.MouseEvent) => {
    if (event.location_url) {
      e.stopPropagation()
      window.open(event.location_url, '_blank')
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/event-detail/${event.id}`)
    }
  }

  return (
    <div className="w-full">
      <div
        onClick={handleCardClick}
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${
          isActive
            ? 'border-blue-500 shadow-lg shadow-blue-900/20'
            : 'border-gray-700 shadow-md hover:shadow-lg hover:shadow-gray-900/50'
        }`}
      >
        {/* Background Image */}
        {event.image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
          </div>
        )}

        {/* Content */}
        <div
          className={`relative z-20 p-6 ${
            event.image_url
              ? 'text-white'
              : isActive
              ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30'
              : 'bg-gray-800'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <h3
              className={`text-xl font-bold ${
                event.image_url
                  ? 'text-white'
                  : isActive
                  ? 'text-blue-100'
                  : 'text-gray-200'
              }`}
            >
              {event.title}
            </h3>
            {isActive && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-md">
                Aktif
              </span>
            )}
          </div>

          {event.description && (
            <p
              className={`mb-4 line-clamp-2 ${
                event.image_url
                  ? 'text-white/90'
                  : 'text-gray-400'
              }`}
            >
              {event.description}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div
              className={`flex items-center ${
                event.image_url ? 'text-white/90' : 'text-gray-300'
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
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
              <span>{formatDate(event.date)}</span>
            </div>

            {event.location && (
              <div
                className={`flex items-center ${
                  event.image_url ? 'text-white/90' : 'text-gray-300'
                } ${event.location_url ? 'cursor-pointer hover:underline' : ''}`}
                onClick={handleLocationClick}
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                <span>{event.location}</span>
                {event.location_url && (
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
