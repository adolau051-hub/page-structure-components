/*
# Allow authenticated uploads to media bucket (staff-gated video management)

1. Purpose
   Staff need to replace the hero background video through an in-app upload page.
   The Next.js API route (/api/staff/upload-video) checks the staff_session cookie
   BEFORE forwarding the upload, so only authenticated staff reach Supabase Storage.

2. Security
   - INSERT (upsert) policy for authenticated users on the "media" bucket only.
   - The staff session check in the API route is the first gate; this policy is
     the second gate. Anonymous visitors cannot upload.
   - The public SELECT (read) policy added previously remains unchanged.
*/

DROP POLICY IF EXISTS "auth_upload_media" ON storage.objects;
CREATE POLICY "auth_upload_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media" ON storage.objects;
CREATE POLICY "auth_update_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');