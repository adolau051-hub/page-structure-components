/*
# Remove temporary anon upload policy for media bucket

The hero video has been uploaded. Drop the temporary INSERT policy so
unauthenticated visitors can no longer write to the "media" bucket.
Only the public SELECT (read) policy remains.
*/

DROP POLICY IF EXISTS "temp_anon_upload_media" ON storage.objects;