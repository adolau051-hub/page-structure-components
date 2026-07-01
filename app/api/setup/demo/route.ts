import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedStaffAccount } from '@/lib/setup-staff'

const EXPERIENCES = [
  { name: 'Seasonal Tasting', description: "A curated selection of the season's finest dishes", price_gbp: 65 },
  { name: "Chef's Table", description: 'Intimate experience at the kitchen counter with Chef Julian', price_gbp: 130 },
  { name: 'The Hearth Table', description: 'Communal dining by the fireplace with other guests', price_gbp: 75 },
  { name: 'Walk-In Dining', description: 'Casual walk-ins welcome - dine à la carte from our full menu', price_gbp: 0 },
]

const RESTAURANT_CONFIG = {
  max_covers_per_night: 40,
  booking_advance_days: 30,
  seating_slot_interval_minutes: 30,
  opening_hour: '17:00',
  closing_hour: '23:00',
  staff_notification_email: 'hello@riverstone-kitchen.co.uk',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const results = { experiences: 0, config: false, staff: false, errors: [] as string[] }

    const { data: existingExp } = await supabase.from('experiences').select('id').limit(1)
    if (!existingExp || existingExp.length === 0) {
      const { error: expError } = await supabase
        .from('experiences')
        .insert(EXPERIENCES)
      if (expError) {
        results.errors.push(`experiences: ${expError.message}`)
      } else {
        results.experiences = EXPERIENCES.length
      }
    }

    const { data: existingConfig } = await supabase
      .from('restaurant_config')
      .select('id')
      .limit(1)
      .maybeSingle()
    if (!existingConfig) {
      const { error: configError } = await supabase
        .from('restaurant_config')
        .insert([RESTAURANT_CONFIG])
      if (configError) {
        results.errors.push(`config: ${configError.message}`)
      } else {
        results.config = true
      }
    }

    const staffResult = await seedStaffAccount()
    if (staffResult.error) {
      results.errors.push(`staff: ${staffResult.error}`)
    } else {
      results.staff = true
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      results,
      message: 'Demo data seeded successfully',
    })
  } catch (error) {
    console.error('[setup/demo] error:', error)
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    )
  }
}
