'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanFailure?: (error: string) => void
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startScanning = async () => {
    try {
      setError(null)
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText)
          stopScanning()
        },
        (err: string | { message?: string } | unknown) => {
          // Ignore scanning errors (they're expected during scanning)
          if (onScanFailure) {
            // err can be a string or an object with message property
            let errorMessage = 'Scan error'
            if (typeof err === 'string') {
              errorMessage = err
            } else if (err && typeof err === 'object' && 'message' in err) {
              errorMessage = (err as { message: string }).message
            }
            onScanFailure(errorMessage)
          }
        }
      )
      setIsScanning(true)
    } catch (err: any) {
      setError(err.message || 'Kamera erişimi sağlanamadı')
      console.error('QR Scanner error:', err)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
        scannerRef.current = null
        setIsScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={containerRef}
        id="qr-reader"
        className="w-full rounded-lg overflow-hidden bg-gray-900 dark:bg-gray-950"
        style={{ minHeight: '300px' }}
      />

      <div className="mt-4 flex flex-col items-center gap-4">
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
            {error}
          </div>
        )}

        {!isScanning ? (
          <button
            onClick={startScanning}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors font-semibold"
          >
            QR Kod Okumayı Başlat
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition-colors font-semibold"
          >
            Okumayı Durdur
          </button>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          QR kodu kameranın önüne getirin. Otomatik olarak okunacaktır.
        </p>
      </div>
    </div>
  )
}
