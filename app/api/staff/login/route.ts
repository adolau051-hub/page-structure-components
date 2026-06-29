import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { password, username } = await request.json()

    if (!password || !username) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch the staff account by username
    const { data: staffData, error: fetchError } = await supabase
      .from('staff_accounts')
      .select('id, password_hash, email')
      .eq('email', username)
      .limit(1)
      .single()

    if (fetchError || !staffData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, staffData.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last_login
    await supabase
      .from('staff_accounts')
      .update({ last_login: new Date().toISOString() })
      .eq('id', staffData.id)

    // Create response with session cookie
    const response = NextResponse.json({ success: true, staffId: staffData.id })
    
    // Set cookie with explicit settings for both dev and production
    response.cookies.set({
      name: 'staff_session',
      value: staffData.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Staff login error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
