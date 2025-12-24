'use client'

import { useEffect, useState } from 'react'
import { calculateTimeRemaining } from '@/lib/utils/time'

interface CountdownTimerProps {
  targetDate: string | Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(targetDate)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">Etkinlik başladı!</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {timeRemaining.days > 0 && (
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {timeRemaining.days}
          </div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Gün</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {String(timeRemaining.hours).padStart(2, '0')}
        </div>
        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Saat</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {String(timeRemaining.minutes).padStart(2, '0')}
        </div>
        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Dakika</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
          {String(timeRemaining.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Saniye</div>
      </div>
    </div>
  )
}

