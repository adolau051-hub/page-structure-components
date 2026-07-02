const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const BUCKET = 'media'
const OBJECT = 'hero.mp4'

export const HERO_VIDEO_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${OBJECT}`
  : '/restaurant_main.mp4'
