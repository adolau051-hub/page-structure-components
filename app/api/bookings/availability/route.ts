import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/booking-utils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, experienceId } = body

    if (!date || !experienceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const slots = await getAvailableSlots(date, experienceId)

    return NextResponse.json({ slots }, { status: 200 })
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
