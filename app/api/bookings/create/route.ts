import { createClient } from '@/lib/supabase/server'
import { validateBookingParams } from '@/lib/booking-utils'
import { sendBookingConfirmation, sendStaffNotification } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      partySize,
      experience,
      date,
      time,
      dietaryRestrictions,
      specialNotes,
    } = body

    // Validate input
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate booking params
    const validation = validateBookingParams(parseInt(partySize))
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const supabase = await createClient()

    // Get experience ID
    const { data: experienceData } = await supabase
      .from('experiences')
      .select('id')
      .eq('name', experience === 'chefs-table' ? "Chef's Table" : experience === 'hearth-table' ? 'The Hearth Table' : 'Seasonal Tasting')
      .single()

    if (!experienceData) {
      return NextResponse.json({ error: 'Invalid experience' }, { status: 400 })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          experience_id: experienceData.id,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          party_size: parseInt(partySize),
          booking_date: date,
          booking_time: time,
          dietary_restrictions: dietaryRestrictions || null,
          special_notes: specialNotes || null,
          status: 'confirmed',
        },
      ])
      .select()
      .single()

    if (bookingError) {
      console.error('Booking error:', bookingError)
      return NextResponse.json(
        { error: bookingError.message || 'Failed to create booking' },
        { status: 400 }
      )
    }

    // Send confirmation email
    try {
      await sendBookingConfirmation(email, {
        name,
        date,
        time,
        partySize: parseInt(partySize),
        experience,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    // Send staff notification
    try {
      const { data: configData } = await supabase
        .from('restaurant_config')
        .select('staff_notification_email')
        .single()

      if (configData?.staff_notification_email) {
        await sendStaffNotification(configData.staff_notification_email, {
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          date,
          time,
          partySize: parseInt(partySize),
          experience,
          dietaryRestrictions,
          specialNotes,
        })
      }
    } catch (emailError) {
      console.error('Failed to send staff notification:', emailError)
    }

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
