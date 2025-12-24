'use client'

import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'
import { useState } from 'react'

interface QRCodeDisplayProps {
  value: string
  participantName?: string
}

function QRInstruction() {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 max-w-xs">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          QR Kod Nasıl Kullanılır?
        </p>
        <ul className="text-xs text-blue-700 dark:text-blue-400 text-left space-y-1">
          <li>1. QR kodunuzu ekranınızda tam ekran yapın</li>
          <li>2. Kapıdaki görevliye telefonunuzu gösterin</li>
          <li>3. Görevli QR kodu okutacak ve girişiniz onaylanacak</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="relative w-64 h-32 md:w-80 md:h-40">
      <Image
        src="/qr-instruction.gif"
        alt="QR kod kullanım talimatı"
        fill
        className="object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default function QRCodeDisplay({ value, participantName }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Etkinlik Giriş QR Kodunuz
        </h3>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <QRCodeSVG
            value={value}
            size={256}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
        </div>
        {participantName && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Bu QR kodu kapıdaki görevliye okutunuz
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        <QRInstruction />
      </div>
    </div>
  )
}

