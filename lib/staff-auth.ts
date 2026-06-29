import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

/**
 * Authenticate staff with password.
 * Returns staff_accounts.id if valid, null otherwise.
 */
export async function authenticateStaff(password: string): Promise<string | null> {
  const supabase = await createClient()

  // Fetch staff account (in production, you'd query by email or identifier)
  const { data, error } = await supabase
    .from('staff_accounts')
    .select('id, password_hash')
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  // Verify password
  const isValid = await bcrypt.compare(password, data.password_hash)
  if (!isValid) {
    return null
  }

  // Update last_login
  await supabase
    .from('staff_accounts')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id)

  return data.id
}

/**
 * Create a staff session cookie
 */
export async function createStaffSession(staffId: string, response: any) {
  response.cookies.set('staff_session', staffId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/**
 * Get staff session from cookies
 */
export function getStaffSession(request: any): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    return null
  }

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c: string) => c.split('='))
  )
  return cookies.staff_session || null
}

/**
 * Clear staff session
 */
export async function clearStaffSession(response: any) {
  response.cookies.set('staff_session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
}
