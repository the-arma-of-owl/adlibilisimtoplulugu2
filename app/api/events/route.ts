import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      // If table doesn't exist yet, return empty array instead of error
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        return NextResponse.json({ data: [], error: null })
      }
      throw error
    }

    return NextResponse.json({ data: data || [], error: null })
  } catch (error: any) {
    // If Supabase is not configured, return empty array instead of error
    if (error.message.includes('environment variables are missing')) {
      return NextResponse.json({ data: [], error: null })
    }
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 500 }
    )
  }
}

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
    const { title, description, date, location, location_url, image_url, gallery_images, is_active } = body

    // If setting as active, deactivate all other events
    if (is_active) {
      await supabase
        .from('events')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000')
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        date,
        location,
        location_url: location_url || null,
        image_url: image_url || null,
        gallery_images: gallery_images && Array.isArray(gallery_images) ? gallery_images : null,
        is_active: is_active || false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

