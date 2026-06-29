import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the most recent booking for this email
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        experiences (name, price_gbp)
      `
      )
      .eq('customer_email', email)
      .order('booking_date', { ascending: false })
      .limit(1)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: 'No booking found for this email' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking }, { status: 200 })
  } catch (error) {
    console.error('Booking lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
