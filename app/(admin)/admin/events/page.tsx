'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function EventsManagementPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    location_url: '',
    image_url: '',
    gallery_images: [] as string[],
    is_active: false,
  })
  const [galleryInput, setGalleryInput] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const result = await response.json()
      setEvents(result.data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save event')

      await fetchEvents()
      setShowForm(false)
      setEditingEvent(null)
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        location_url: '',
        image_url: '',
        gallery_images: [],
        is_active: false,
      })
      setGalleryInput('')
    } catch (err) {
      alert('Etkinlik kaydedilirken bir hata oluştu')
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || '',
      location_url: event.location_url || '',
      image_url: event.image_url || '',
      gallery_images: event.gallery_images || [],
      is_active: event.is_active,
    })
    setGalleryInput((event.gallery_images || []).join('\n'))
    setShowForm(true)
    // Scroll to form
    setTimeout(() => {
      document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return
    alert('Veriler silinmez. Etkinliği pasif yapabilirsiniz.')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-100">Etkinlik Yönetimi</h1>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingEvent(null)
              setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                location_url: '',
                image_url: '',
                gallery_images: [],
                is_active: false,
              })
              setGalleryInput('')
              if (!showForm) {
                setTimeout(() => {
                  document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            {showForm ? 'Formu Kapat' : 'Yeni Etkinlik Ekle'}
          </button>
        </div>

        {showForm && (
          <div id="event-form" className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              {editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tarih ve Saat</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Ana Kampüs - Konferans Salonu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Konum Harita Linki (Google Maps)
                </label>
                <input
                  type="url"
                  value={formData.location_url}
                  onChange={(e) =>
                    setFormData({ ...formData, location_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://maps.google.com/..."
                />
                <p className="mt-1 text-xs text-gray-400">
                  Google Maps&apos;ten &quot;Paylaş&quot; &gt; &quot;Bağlantıyı Kopyala&quot; ile alabilirsiniz
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Etkinlik Görseli URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Görselin internet üzerinde erişilebilir bir URL&apos;i olmalı
                </p>
                {formData.image_url && (
                  <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Galeri Görselleri (Her satıra bir URL)
                </label>
                <textarea
                  value={galleryInput}
                  onChange={(e) => {
                    setGalleryInput(e.target.value)
                    const urls = e.target.value
                      .split('\n')
                      .map((url) => url.trim())
                      .filter((url) => url.length > 0)
                    setFormData({ ...formData, gallery_images: urls })
                  }}
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Her satıra bir görsel URL&apos;i ekleyin
                </p>
                {formData.gallery_images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {formData.gallery_images.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border border-gray-600"
                      >
                        <img
                          src={url}
                          alt={`Galeri ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-gray-300">Aktif Etkinlik</label>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Kaydet
              </button>
            </form>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(event.date).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.is_active ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Düzenle
                      </button>
                      <Link
                        href={`/admin/events/${event.id}/participants`}
                        className="text-green-400 hover:text-green-300"
                      >
                        Katılımcılar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-100 flex-1">{event.title}</h3>
                {event.is_active ? (
                  <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs ml-2">
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs ml-2">
                    Pasif
                  </span>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleString('tr-TR')}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Düzenle
                </button>
                <Link
                  href={`/admin/events/${event.id}/participants`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
                >
                  Katılımcılar
                </Link>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <p>Henüz etkinlik bulunmamaktadır.</p>
          </div>
        )}
      </main>
    </div>
  )
}
