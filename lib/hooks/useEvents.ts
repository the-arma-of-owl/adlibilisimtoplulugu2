'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  created_at: string
  updated_at: string
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const result = await response.json()

        if (result.error) {
          // If Supabase is not configured, show helpful message
          if (result.error.includes('environment variables are missing')) {
            setError('Supabase yapılandırılmamış. Lütfen .env.local dosyasını oluşturun.')
          } else {
            setError(result.error)
          }
          setEvents([])
        } else {
          setEvents(result.data || [])
          setError(null)
        }
      } catch (err: any) {
        setError('Etkinlikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
        console.error('Error fetching events:', err)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error }
}

