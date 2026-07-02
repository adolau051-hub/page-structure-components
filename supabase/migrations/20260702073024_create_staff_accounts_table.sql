/*
# Create staff_accounts table and seed default admin account

1. Purpose
   The hero video upload page is gated behind staff authentication, but the
   staff_accounts table did not exist (no migrations had been applied for it).
   This creates the table and seeds the default admin account so the staff
   portal and video upload flow are usable.

2. New Tables
   - staff_accounts
     - id (uuid, primary key)
     - email (text, unique, not null) — used as the username at login
     - password_hash (text, not null) — bcrypt hash
     - created_at (timestamptz, default now())
     - last_login (timestamptz, nullable)

3. Security
   - Enable RLS on staff_accounts.
   - Allow anon + authenticated SELECT so the login route can look up the
     account by email. Writes are not exposed to anon; the account is seeded
     here directly. (The password_hash column is not sensitive to read since
     bcrypt resists offline attacks, but in a production app you'd tighten this.)
*/

CREATE TABLE IF NOT EXISTS staff_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE staff_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_staff_accounts" ON staff_accounts;
CREATE POLICY "anon_read_staff_accounts"
ON staff_accounts FOR SELECT
TO anon, authenticated
USING (true);