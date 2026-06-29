import { createClient } from '@/lib/supabase/server'

/**
 * Get available time slots for a given date
 * Calculates availability based on restaurant config and existing bookings
 */
export async function getAvailableSlots(
  bookingDate: string, // YYYY-MM-DD
  experienceId: string
) {
  const supabase = await createClient()

  // Get restaurant config
  const { data: configData } = await supabase
    .from('restaurant_config')
    .select('*')
    .single()

  if (!configData) {
    throw new Error('Restaurant config not found')
  }

  // Get all bookings for this date
  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('booking_time, party_size')
    .eq('booking_date', bookingDate)
    .eq('experience_id', experienceId)
    .eq('status', 'confirmed')

  const bookedSlots = new Map<string, number>()
  bookingsData?.forEach((booking) => {
    const current = bookedSlots.get(booking.booking_time) || 0
    bookedSlots.set(booking.booking_time, current + booking.party_size)
  })

  // Generate available slots
  const slots: Array<{ time: string; available: boolean; capacity: number }> =
    []
  const [openHour, openMinute] = configData.opening_hour.split(':').map(Number)
  const [closeHour, closeMinute] = configData.closing_hour
    .split(':')
    .map(Number)

  let currentDate = new Date()
  currentDate.setHours(openHour, openMinute, 0, 0)
  const closeDate = new Date()
  closeDate.setHours(closeHour, closeMinute, 0, 0)

  while (currentDate < closeDate) {
    const timeStr = currentDate.toTimeString().slice(0, 5) // HH:MM
    const booked = bookedSlots.get(timeStr) || 0
    const available = booked < configData.max_covers_per_night

    slots.push({
      time: timeStr,
      available,
      capacity: configData.max_covers_per_night - booked,
    })

    currentDate.setMinutes(
      currentDate.getMinutes() + configData.seating_slot_interval_minutes
    )
  }

  return slots
}

/**
 * Validate booking parameters
 */
export function validateBookingParams(
  partySize: number,
  bookingDate: string,
  minAdvanceDays = 0,
  maxAdvanceDays = 30
): { valid: boolean; error?: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const booking = new Date(bookingDate)
  booking.setHours(0, 0, 0, 0)

  const daysAhead = Math.floor((booking.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysAhead < minAdvanceDays) {
    return { valid: false, error: 'Bookings must be at least one day in advance' }
  }

  if (daysAhead > maxAdvanceDays) {
    return { valid: false, error: `Bookings can only be made up to ${maxAdvanceDays} days in advance` }
  }

  if (partySize < 1 || partySize > 20) {
    return { valid: false, error: 'Party size must be between 1 and 20 people' }
  }

  if (partySize > 6) {
    return { valid: false, error: 'Parties larger than 6 require special arrangements. Please contact us.' }
  }

  return { valid: true }
}

/**
 * Calculate no-show grace period expiry
 */
export function getNoShowExpiryTime(bookingDate: string, bookingTime: string, gracePeriodMinutes = 15): Date {
  const dateTime = new Date(`${bookingDate}T${bookingTime}:00`)
  dateTime.setMinutes(dateTime.getMinutes() + gracePeriodMinutes)
  return dateTime
}
