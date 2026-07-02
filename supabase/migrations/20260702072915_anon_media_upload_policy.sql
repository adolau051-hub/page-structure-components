/*
# Allow uploads to media bucket (staff-gated via API route)

The staff authentication system uses a custom cookie (staff_session), not
Supabase Auth. The Next.js server client therefore runs as the anon role.
The /api/staff/upload-video route checks the staff_session cookie BEFORE
attempting the upload, so only authenticated staff can reach this code path.
This policy allows anon + authenticated INSERT/UPDATE on the "media" bucket
as the storage-level gate; the staff session check in the API route is the
primary authentication gate.
*/

DROP POLICY IF EXISTS "auth_upload_media" ON storage.objects;
CREATE POLICY "auth_upload_media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media" ON storage.objects;
CREATE POLICY "auth_update_media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');