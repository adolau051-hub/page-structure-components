import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStaffSessionId } from '@/lib/staff-middleware'

export async function GET(request: NextRequest) {
  try {
    // Check staff session
    const staffId = getStaffSessionId(request)
    if (!staffId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Fetch bookings (all statuses for staff to manage)
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(
        `
        id,
        customer_name,
        customer_email,
        customer_phone,
        party_size,
        booking_date,
        booking_time,
        status,
        special_notes,
        dietary_restrictions,
        experiences(name, price_gbp)
        `
      )
      .in('status', ['confirmed', 'arrived', 'no_show', 'cancelled'])
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('[v0] Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check staff session
    const staffId = getStaffSessionId(request)
    if (!staffId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookingId, status } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'bookingId and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['confirmed', 'cancelled', 'arrived', 'no_show']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update booking status
    const { error } = await supabase
      .from('bookings')
      .update({
        status,
        ...(status === 'cancelled' && {
          cancelled_at: new Date().toISOString(),
        }),
      })
      .eq('id', bookingId)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Booking update error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
