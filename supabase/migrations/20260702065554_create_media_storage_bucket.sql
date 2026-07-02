/*
# Create public media Storage bucket for hero video

1. Purpose
   The hero background video was previously stored as a binary file in /public.
   Bolt's Version History / checkpoint restores silently revert files in /public,
   causing the manually-replaced video to revert to its original copy after ~10 minutes.
   Supabase Storage is NOT affected by Bolt version restores, so hosting the video
   there makes it durable across rollbacks.

2. Storage changes
   - Create a public bucket named "media" (id "media") if it does not already exist.
   - Mark it public so objects are readable via a simple URL without signed tokens.

3. Security
   - Enable a SELECT (read) storage policy allowing anyone (anon + authenticated)
     to read objects in the "media" bucket. This is intentional: the hero video is
     public website content served to every visitor with no sign-in.
   - Writes are NOT opened to anon; uploads are performed via the service-role key
     (server-side) only, so unauthenticated visitors cannot modify bucket contents.
*/

INSERT INTO storage.buckets (id, name, public)
SELECT 'media', 'media', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'media'
);

DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');