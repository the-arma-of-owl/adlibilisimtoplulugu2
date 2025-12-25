'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  id: string
  name: string
  phone: string
  entry_code: string
  has_entered: boolean
}

interface Event {
  id: string
  title: string
}

export default function LotteryPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set())
  const [winnerCount, setWinnerCount] = useState<number>(1)
  const [removeWinners, setRemoveWinners] = useState<boolean>(false)
  const [winners, setWinners] = useState<Participant[]>([])
  const [loading, setLoading] = useState(false)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      fetchParticipants()
    } else {
      setParticipants([])
      setSelectedParticipants(new Set())
    }
  }, [selectedEventId])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const result = await response.json()
      setEvents(result.data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }

  const fetchParticipants = async (clearSelections = true) => {
    try {
      const response = await fetch(`/api/admin/participants?event_id=${selectedEventId}`)
      const result = await response.json()
      setParticipants(result.data || [])
      if (clearSelections) {
        setSelectedParticipants(new Set())
        setWinners([])
      }
    } catch (err) {
      console.error('Error fetching participants:', err)
    }
  }

  const toggleParticipant = (id: string) => {
    const newSelected = new Set(selectedParticipants)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedParticipants(newSelected)
  }

  const selectAll = () => {
    setSelectedParticipants(new Set(participants.map((p) => p.id)))
  }

  const deselectAll = () => {
    setSelectedParticipants(new Set())
  }

  const handleDraw = async () => {
    if (selectedParticipants.size === 0) {
      alert('Lütfen en az bir katılımcı seçin')
      return
    }

    if (winnerCount < 1 || winnerCount > selectedParticipants.size) {
      alert(`Kazanan sayısı 1 ile ${selectedParticipants.size} arasında olmalıdır`)
      return
    }

    setDrawing(true)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: Array.from(selectedParticipants),
          winnerCount,
          removeWinners,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Kura çekme başarısız')
      }

      setWinners(result.data.winners || [])
      
      // If winners were removed, refresh the participant list
      if (removeWinners) {
        // Remove winners from selected participants set
        const newSelected = new Set(selectedParticipants)
        result.data.winners.forEach((winner: Participant) => {
          newSelected.delete(winner.id)
        })
        setSelectedParticipants(newSelected)
        
        // Refresh the participant list (winners will be automatically removed since they're deleted from DB)
        // Don't clear winners or selections - we want to keep showing winners and updated selection
        await fetchParticipants(false)
      }
    } catch (error: any) {
      alert(error.message || 'Kura çekilirken bir hata oluştu')
    } finally {
      setLoading(false)
      setDrawing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">Kura Çekme</h1>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm w-full sm:w-auto text-center"
            >
              ← Admin Paneli
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Selection */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Etkinlik Seç
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Etkinlik seçin...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <>
            {/* Participants Selection */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-100">
                  Katılımcıları Seç ({selectedParticipants.size} seçili)
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-1 sm:flex-none"
                  >
                    Tümünü Seç
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex-1 sm:flex-none"
                  >
                    Seçimi Temizle
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {participants.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Henüz katılımcı yok</p>
                ) : (
                  participants.map((participant) => (
                    <label
                      key={participant.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedParticipants.has(participant.id)
                          ? 'bg-blue-900/30 border-blue-600'
                          : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.has(participant.id)}
                        onChange={() => toggleParticipant(participant.id)}
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-100">{participant.name}</div>
                        <div className="text-sm text-gray-400">
                          {participant.phone} • {participant.entry_code}
                        </div>
                      </div>
                      {participant.has_entered && (
                        <span className="ml-2 px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                          Giriş Yapıldı
                        </span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Lottery Settings */}
            {selectedParticipants.size > 0 && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Kura Ayarları</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kazanan Sayısı (1-{selectedParticipants.size})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedParticipants.size}
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeWinners"
                      checked={removeWinners}
                      onChange={(e) => setRemoveWinners(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="removeWinners" className="ml-2 text-sm text-gray-300">
                      Kazananları listeden çıkar
                    </label>
                  </div>

                  <button
                    onClick={handleDraw}
                    disabled={loading || drawing}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {drawing ? 'Kura Çekiliyor...' : 'Kura Çek'}
                  </button>
                </div>
              </div>
            )}

            {/* Winners Display */}
            {winners.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg shadow-lg p-4 sm:p-6 border border-purple-700">
                <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
                  🎉 Kazananlar 🎉
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {winners.map((winner, index) => (
                    <div
                      key={winner.id || index}
                      className="bg-gray-800/50 rounded-lg p-4 border border-purple-600"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="font-bold text-gray-100 text-lg">
                          {winner.name || 'Bilinmeyen'}
                        </div>
                        {winner.phone && (
                          <div className="text-sm text-gray-400 mt-1">{winner.phone}</div>
                        )}
                        {winner.entry_code && (
                          <div className="text-sm text-gray-400 font-mono mt-1">{winner.entry_code}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {removeWinners && (
                  <div className="mt-4 text-center text-sm text-gray-300">
                    ✅ Kazananlar listeden çıkarıldı
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

