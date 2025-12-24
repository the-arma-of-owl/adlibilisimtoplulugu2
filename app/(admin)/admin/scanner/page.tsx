'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRScanner from '@/components/QRScanner'
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

export default function ScannerPage() {
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [scanSuccess, setScanSuccess] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      fetchParticipants()
    }
  }, [selectedEventId])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const result = await response.json()
      setEvents(result.data || [])
      // Select active event by default
      const activeEvent = result.data?.find((e: any) => e.is_active)
      if (activeEvent) {
        setSelectedEventId(activeEvent.id)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }

  const fetchParticipants = async () => {
    if (!selectedEventId) return
    try {
      const response = await fetch(
        `/api/admin/participants?event_id=${selectedEventId}`
      )
      const result = await response.json()
      setParticipants(result.data || [])
    } catch (err) {
      console.error('Error fetching participants:', err)
    }
  }

  const handleScanSuccess = async (qrToken: string) => {
    try {
      const response = await fetch('/api/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_token: qrToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        setScanError(result.error || 'QR kod okunamadı')
        setScanSuccess(null)
        return
      }

      if (result.alreadyEntered) {
        setScanError('Bu kişi zaten giriş yapmış')
        setScanSuccess(null)
      } else {
        setScanSuccess(`Giriş onaylandı: ${result.data.name}`)
        setScanError(null)
        // Refresh participants list
        fetchParticipants()
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setScanSuccess(null)
        setScanError(null)
      }, 3000)
    } catch (err) {
      setScanError('QR kod işlenirken bir hata oluştu')
      setScanSuccess(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">QR Kod Okuyucu</h1>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Selector */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etkinlik Seçin
          </label>
          <select
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Tüm Etkinlikler</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {/* Success/Error Messages */}
        {scanSuccess && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
            {scanSuccess}
          </div>
        )}
        {scanError && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {scanError}
          </div>
        )}

        {/* QR Scanner */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">QR Kod Okuma</h2>
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanFailure={(err) => {
              // Ignore scanning errors
            }}
          />
        </div>

        {/* Participants Table */}
        <ParticipantsTable
          participants={participants}
          onRefresh={fetchParticipants}
        />
      </main>
    </div>
  )
}
