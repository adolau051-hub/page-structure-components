import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

/**
 * Initialize staff account with a password and username.
 * Call this once during setup or when resetting staff credentials.
 */
export async function setupStaffAccount(password: string, username: string = 'admin@lumiere-bistro.co.uk') {
  try {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const supabase = await createClient()

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Check if staff account exists
    const { data: existingStaff } = await supabase
      .from('staff_accounts')
      .select('id')
      .limit(1)
      .single()

    if (existingStaff) {
      // Update existing staff account
      const { error: updateError } = await supabase
        .from('staff_accounts')
        .update({ password_hash: passwordHash, email: username })
        .eq('id', existingStaff.id)

      if (updateError) {
        throw new Error(`Failed to update staff account: ${updateError.message}`)
      }

      return { success: true, message: 'Staff account password updated' }
    } else {
      // Create new staff account
      const { error: insertError } = await supabase
        .from('staff_accounts')
        .insert([{ password_hash: passwordHash, email: username }])

      if (insertError) {
        throw new Error(`Failed to create staff account: ${insertError.message}`)
      }

      return { success: true, message: 'Staff account created successfully' }
    }
  } catch (error) {
    console.error('[v0] Setup error:', error)
    throw error
  }
}
