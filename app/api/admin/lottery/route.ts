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
    const { participantIds, winnerCount, removeWinners } = body

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Participant IDs are required' },
        { status: 400 }
      )
    }

    if (!winnerCount || winnerCount < 1 || winnerCount > participantIds.length) {
      return NextResponse.json(
        { error: 'Winner count must be between 1 and the number of participants' },
        { status: 400 }
      )
    }

    // Shuffle array and pick winners
    const shuffled = [...participantIds].sort(() => Math.random() - 0.5)
    const winners = shuffled.slice(0, winnerCount)

    // Get winner details BEFORE deleting (so we can return them even after deletion)
    const { data: winnerDetails, error: fetchError } = await supabase
      .from('participants')
      .select('id, name, phone, entry_code')
      .in('id', winners)

    if (fetchError) throw fetchError

    // If removeWinners is true, delete winners from participants AFTER getting details
    if (removeWinners && winnerDetails && winnerDetails.length > 0) {
      const { error: deleteError } = await supabase
        .from('participants')
        .delete()
        .in('id', winners)

      if (deleteError) throw deleteError
    }

    return NextResponse.json({
      data: {
        winners: winnerDetails || [],
        winnerCount: winners.length,
        removed: removeWinners,
      },
      error: null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

