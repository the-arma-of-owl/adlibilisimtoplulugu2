'use client'

import { formatDate } from '@/lib/utils/time'

interface Participant {
  id: string
  name: string
  phone: string
  entry_code: string
  has_entered: boolean
  entered_at: string | null
  created_at: string
}

interface ParticipantsTableProps {
  participants: Participant[]
  onRefresh?: () => void
}

export default function ParticipantsTable({
  participants,
  onRefresh,
}: ParticipantsTableProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-100">
          Katılımcılar ({participants.length})
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Yenile
          </button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  İsim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Giriş Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Giriş Zamanı
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    Henüz katılımcı bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className={
                      participant.has_entered
                        ? 'bg-green-900/20'
                        : 'hover:bg-gray-700/50'
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {participant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {participant.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {participant.entry_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.has_entered ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-300">
                          Giriş Yapıldı
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/30 text-yellow-300">
                          Beklemede
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {participant.entered_at ? formatDate(participant.entered_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {participants.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400 border border-gray-700">
            Henüz katılımcı bulunmamaktadır.
          </div>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className={`bg-gray-800 rounded-lg p-4 border ${
                participant.has_entered
                  ? 'border-green-700 bg-green-900/10'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-100">{participant.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{participant.phone}</p>
                </div>
                {participant.has_entered ? (
                  <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-semibold ml-2">
                    Giriş Yapıldı
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-semibold ml-2">
                    Beklemede
                  </span>
                )}
              </div>
              <div className="space-y-2 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Giriş Kodu:</span>
                  <span className="text-gray-100 font-mono font-semibold">{participant.entry_code}</span>
                </div>
                {participant.entered_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Giriş Zamanı:</span>
                    <span className="text-gray-300">{formatDate(participant.entered_at)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
          <div className="text-sm text-blue-400 font-medium">Toplam</div>
          <div className="text-2xl font-bold text-blue-300">{participants.length}</div>
        </div>
        <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
          <div className="text-sm text-green-400 font-medium">Giriş Yapan</div>
          <div className="text-2xl font-bold text-green-300">
            {participants.filter((p) => p.has_entered).length}
          </div>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
          <div className="text-sm text-yellow-400 font-medium">Bekleyen</div>
          <div className="text-2xl font-bold text-yellow-300">
            {participants.filter((p) => !p.has_entered).length}
          </div>
        </div>
      </div>
    </div>
  )
}
