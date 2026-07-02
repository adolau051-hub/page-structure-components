/*
# Temporary: allow anon upload to media bucket (one-time video upload)

This policy is temporary and will be dropped immediately after the hero video
is uploaded via the Storage REST API. It allows the anon key to INSERT objects
into the "media" bucket only.
*/

DROP POLICY IF EXISTS "temp_anon_upload_media" ON storage.objects;
CREATE POLICY "temp_anon_upload_media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'media');