import { createClient } from '@/lib/supabase/server'
import { sendReminderEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sends reminder emails for bookings happening tomorrow
 * Should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization header if needed for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Find all confirmed bookings for tomorrow
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        experiences (name)
      `
      )
      .eq('booking_date', tomorrowStr)
      .eq('status', 'confirmed')

    if (error) {
      throw error
    }

    let sent = 0
    let failed = 0

    for (const booking of bookings || []) {
      try {
        await sendReminderEmail(booking.customer_email, {
          name: booking.customer_name,
          date: booking.booking_date,
          time: booking.booking_time,
          partySize: booking.party_size,
          experience: booking.experiences?.name || 'Dining Experience',
        })
        sent++
      } catch (emailError) {
        console.error(`Failed to send reminder to ${booking.customer_email}:`, emailError)
        failed++
      }
    }

    return NextResponse.json(
      { success: true, sent, failed, total: bookings?.length || 0 },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send reminders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
