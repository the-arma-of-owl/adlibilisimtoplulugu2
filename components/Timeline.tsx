'use client'

import { useEffect, useRef } from 'react'
import EventCard from './EventCard'

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

interface TimelineProps {
  events: Event[]
  onEventClick?: (eventId: string) => void
}

export default function Timeline({ events, onEventClick }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Find active event index
  const activeIdx = sortedEvents.findIndex((e) => e.is_active)

  // Scroll to center active event on mount - improved for mobile
  useEffect(() => {
    if (activeIdx !== -1 && scrollContainerRef.current) {
      const scrollToActive = () => {
        const container = scrollContainerRef.current
        const activeEvent = sortedEvents[activeIdx]
        const activeCard = cardRefs.current[activeEvent.id]
        
        if (container && activeCard) {
          // Use scrollIntoView for better mobile compatibility
          activeCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          })
        }
      }

      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(scrollToActive, 100)
        setTimeout(scrollToActive, 300)
        setTimeout(scrollToActive, 600)
      })

      // Wait for images to load
      const images = scrollContainerRef.current.querySelectorAll('img')
      if (images.length > 0) {
        const imagePromises = Array.from(images).map((img) => {
          if (img.complete) {
            return Promise.resolve()
          }
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
          })
        })

        Promise.all(imagePromises).then(() => {
          setTimeout(scrollToActive, 100)
        })
      }
    }
  }, [activeIdx, sortedEvents])

  if (sortedEvents.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p>Henüz etkinlik bulunmamaktadır.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden py-8">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory pb-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(75, 85, 99, 0.3) transparent',
        }}
      >
        {sortedEvents.map((event) => {
          const isActive = event.is_active

          return (
            <div
              key={event.id}
              ref={(el) => {
                cardRefs.current[event.id] = el
              }}
              className="flex-shrink-0 snap-center"
            >
              <div className="w-80 md:w-96 mx-4">
                <EventCard
                  event={event}
                  isActive={isActive}
                  distance={0}
                  onClick={onEventClick ? () => onEventClick(event.id) : undefined}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline dots indicator */}
      {sortedEvents.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {sortedEvents.map((event) => {
            const isActive = event.is_active
            return (
              <button
                key={event.id}
                onClick={() => {
                  const card = cardRefs.current[event.id]
                  if (card) {
                    card.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center',
                    })
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-blue-400 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to event: ${event.title}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
