import { NextRequest, NextResponse } from 'next/server'
import { setupStaffAccount } from '@/lib/setup-staff'

/**
 * POST /api/setup/demo
 * Initialize demo account for testing
 * Demo Credentials:
 * Username: admin@riverstone-kitchen.co.uk
 * Password: Demo123!
 */
export async function POST(request: NextRequest) {
  try {
    const result = await setupStaffAccount(
      'Demo123!',
      'admin@riverstone-kitchen.co.uk'
    )
    return NextResponse.json({
      ...result,
      credentials: {
        username: 'admin@riverstone-kitchen.co.uk',
        password: 'Demo123!',
      },
    })
  } catch (error) {
    console.error('[v0] Demo setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}
