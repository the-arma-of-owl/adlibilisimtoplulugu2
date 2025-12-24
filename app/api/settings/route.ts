import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    let query = supabase.from('settings').select('*')

    if (key) {
      query = query.eq('key', key).single()
    }

    const { data, error } = await query

    if (error) {
      // If table doesn't exist yet, return null data instead of error
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        return NextResponse.json({ data: null, error: null })
      }
      throw error
    }

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    // If Supabase is not configured, return null instead of error
    if (error.message.includes('environment variables are missing')) {
      return NextResponse.json({ data: null, error: null })
    }
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { key, value } = body

    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

