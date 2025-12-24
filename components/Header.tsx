'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

function LogoFallback({ onClick }: { onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <button
        onClick={onClick}
        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
        aria-label="Ana Sayfaya Dön"
      >
        <span className="text-white font-bold text-lg md:text-xl">ABT</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 md:w-16 md:h-16 hover:scale-105 transition-transform cursor-pointer"
      aria-label="Ana Sayfaya Dön"
    >
      <Image
        src="/logo.png"
        alt="Adli Bilişim Topluluğu Logo"
        fill
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
    </button>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogoClick = () => {
    setMenuOpen(false)
    if (pathname === '/') {
      // Zaten ana sayfadaysak, sadece en üste scroll et
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Farklı bir sayfadaysak, ana sayfaya git ve scroll et
      router.push('/')
      // Router push sonrası scroll için kısa bir delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const handleTitleClick = () => {
    handleLogoClick()
  }

  return (
    <header className="w-full px-4 md:px-8 py-4 flex items-center justify-between bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-gray-800/20 border-b border-gray-800/50">
      <div className="flex items-center gap-3">
        <LogoFallback onClick={handleLogoClick} />
        <button
          onClick={handleTitleClick}
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-300 transition-all cursor-pointer"
        >
          Adli Bilişim Topluluğu
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="absolute top-full right-4 mt-2 bg-gray-800 rounded-xl shadow-xl p-4 min-w-[200px] border border-gray-700 z-50">
          <ul className="space-y-2">
            <li>
              <a 
                href="/" 
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
              >
                Ana Sayfa
              </a>
            </li>
            <li>
              <a 
                href="/enter" 
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
              >
                Etkinlik Giriş
              </a>
            </li>
            <li>
              <a 
                href="/admin/login" 
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
              >
                Admin
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

