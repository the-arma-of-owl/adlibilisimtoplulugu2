import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { entry_code } = body

    if (!entry_code) {
      return NextResponse.json(
        { error: 'Entry code is required' },
        { status: 400 }
      )
    }

    // Validate format (XXX-XXX-XXX-XXX)
    const codePattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/
    if (!codePattern.test(entry_code)) {
      return NextResponse.json(
        { error: 'Invalid entry code format' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('participants')
      .select('*, events(*)')
      .eq('entry_code', entry_code.toUpperCase())
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid entry code' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

