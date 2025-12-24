'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ParticipantsTable from '@/components/ParticipantsTable'

interface Participant {
  id: string
  name: string
  phone: string
  entry_code: string
  has_entered: boolean
  entered_at: string | null
  created_at: string
}

export default function EventParticipantsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const [participants, setParticipants] = useState<Participant[]>([])
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    entry_code: '',
  })

  useEffect(() => {
    if (eventId) {
      fetchEvent()
      fetchParticipants()
    }
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const result = await response.json()
      setEvent(result.data)
    } catch (err) {
      console.error('Error fetching event:', err)
    }
  }

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/admin/participants?event_id=${eventId}`)
      const result = await response.json()
      setParticipants(result.data || [])
    } catch (err) {
      console.error('Error fetching participants:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          event_id: eventId,
          entry_code: formData.entry_code.toUpperCase(),
        }),
      })

      if (!response.ok) throw new Error('Failed to add participant')

      await fetchParticipants()
      setShowAddForm(false)
      setFormData({ name: '', phone: '', entry_code: '' })
    } catch (err: any) {
      alert(err.message || 'Katılımcı eklenirken bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
                {event?.title || 'Etkinlik'} - Katılımcılar
              </h1>
              <p className="text-sm text-gray-400 mt-1">{participants.length} katılımcı</p>
            </div>
            <Link
              href="/admin/events"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm w-full sm:w-auto text-center"
            >
              ← Etkinliklere Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm)
              if (!showAddForm) {
                setTimeout(() => {
                  document.getElementById('participant-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
              }
            }}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Formu Kapat' : 'Yeni Katılımcı Ekle'}
          </button>
        </div>

        {showAddForm && (
          <div
            id="participant-form"
            className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-100 mb-4">Yeni Katılımcı Ekle</h2>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İsim</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giriş Kodu</label>
                <input
                  type="text"
                  required
                  value={formData.entry_code}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    if (value.length > 12) value = value.substring(0, 12)
                    let formatted = ''
                    for (let i = 0; i < value.length; i++) {
                      if (i > 0 && i % 3 === 0) formatted += '-'
                      formatted += value[i]
                    }
                    setFormData({ ...formData, entry_code: formatted })
                  }}
                  placeholder="FDG-SGS-DRH-GSE"
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
                  maxLength={15}
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ekle
              </button>
            </form>
          </div>
        )}

        <ParticipantsTable participants={participants} onRefresh={fetchParticipants} />
      </main>
    </div>
  )
}
