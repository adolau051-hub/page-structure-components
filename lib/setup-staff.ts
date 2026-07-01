import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

export const DEFAULT_STAFF_EMAIL = 'admin@riverstone-kitchen.co.uk'
export const DEFAULT_STAFF_PASSWORD = 'riverstone2026'

export async function seedStaffAccount(
  email: string = DEFAULT_STAFF_EMAIL,
  password: string = DEFAULT_STAFF_PASSWORD
): Promise<{ created: boolean; id?: string; error?: string }> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('staff_accounts')
    .select('id, email')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return { created: false, id: existing.id }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('staff_accounts')
    .insert([{ email, password_hash: passwordHash }])
    .select('id')
    .single()

  if (error) {
    return { created: false, error: error.message }
  }

  return { created: true, id: data.id }
}
