import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { qr_token } = body

    if (!qr_token) {
      return NextResponse.json(
        { error: 'QR token is required' },
        { status: 400 }
      )
    }

    // Find participant by QR token
    const { data: participant, error: findError } = await supabase
      .from('participants')
      .select('*')
      .eq('qr_token', qr_token)
      .single()

    if (findError || !participant) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 404 }
      )
    }

    // Check if already entered
    if (participant.has_entered) {
      return NextResponse.json({
        data: participant,
        error: null,
        message: 'Already entered',
        alreadyEntered: true,
      })
    }

    // Update participant entry status
    const { data: updatedParticipant, error: updateError } = await supabase
      .from('participants')
      .update({
        has_entered: true,
        entered_at: new Date().toISOString(),
      })
      .eq('id', participant.id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      data: updatedParticipant,
      error: null,
      message: 'Entry confirmed',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

