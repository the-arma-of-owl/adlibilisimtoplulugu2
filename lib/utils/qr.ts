import crypto from 'crypto'

export function generateQRToken(userId: string, eventId: string): string {
  const data = `${userId}:${eventId}:${Date.now()}`
  const hash = crypto.createHash('sha256').update(data).digest('hex')
  return hash.substring(0, 32)
}

export function validateQRToken(token: string): boolean {
  return token.length === 32 && /^[a-f0-9]+$/.test(token)
}

export function parseQRData(token: string): { userId: string; eventId: string } | null {
  // QR token contains hashed data, we'll need to look it up in database
  // This is just a validation function
  if (!validateQRToken(token)) {
    return null
  }
  return null // Actual parsing will be done via database lookup
}

