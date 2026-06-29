import { createClient } from '@/lib/supabase/server'
import { getNoShowExpiryTime } from '@/lib/booking-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Automatically marks bookings as no-show if customer hasn't arrived
 * Should be called by a cron job after closing time
 * Grace period: 15 minutes after booking time
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get current time
    const now = new Date()
    const currentDateStr = now.toISOString().split('T')[0]
    const currentTimeStr = now.toTimeString().slice(0, 5)

    // Find confirmed bookings from today that are past grace period
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', currentDateStr)
      .eq('status', 'confirmed')
      .lt('booking_time', currentTimeStr)

    if (error) {
      throw error
    }

    let updated = 0

    for (const booking of bookings || []) {
      const expiryTime = getNoShowExpiryTime(booking.booking_date, booking.booking_time)
      
      if (now > expiryTime) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'no_show',
            updated_at: now.toISOString(),
          })
          .eq('id', booking.id)

        if (!updateError) {
          updated++
        }
      }
    }

    return NextResponse.json(
      { success: true, updated, checked: bookings?.length || 0 },
      { status: 200 }
    )
  } catch (error) {
    console.error('Handle no-shows error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
