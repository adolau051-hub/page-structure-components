import { NextRequest, NextResponse } from 'next/server'
import { seedStaffAccount, DEFAULT_STAFF_EMAIL, DEFAULT_STAFF_PASSWORD } from '@/lib/setup-staff'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = body?.email || DEFAULT_STAFF_EMAIL
    const password = body?.password || DEFAULT_STAFF_PASSWORD

    const result = await seedStaffAccount(email, password)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      created: result.created,
      id: result.id,
      email,
      message: result.created
        ? 'Staff account created'
        : 'Staff account already exists',
    })
  } catch (error) {
    console.error('[setup/staff] error:', error)
    return NextResponse.json(
      { error: 'Failed to seed staff account' },
      { status: 500 }
    )
  }
}
