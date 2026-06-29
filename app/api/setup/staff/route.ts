import { NextRequest, NextResponse } from 'next/server'
import { setupStaffAccount } from '@/lib/setup-staff'

/**
 * POST /api/setup/staff
 * Initialize staff account (only works if no staff exists)
 * Request body: { password: string, username?: string }
 * 
 * Demo Credentials:
 * Username: admin@lumiere-bistro.co.uk
 * Password: Demo123!
 */
export async function POST(request: NextRequest) {
  try {
    const { password, username = 'admin@lumiere-bistro.co.uk' } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const result = await setupStaffAccount(password, username)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}
