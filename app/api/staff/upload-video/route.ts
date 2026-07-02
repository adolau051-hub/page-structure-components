import { NextRequest, NextResponse } from 'next/server'
import { getStaffSessionId } from '@/lib/staff-middleware'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'media'
const OBJECT = 'hero.mp4'
const MAX_SIZE = 60 * 1024 * 1024 // 60MB

export async function POST(request: NextRequest) {
  try {
    const staffId = getStaffSessionId(request)
    if (!staffId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only video files are accepted' },
        { status: 400 },
      )
    }

    const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds 60MB limit' },
        { status: 413 },
      )
    }

    const body = await request.arrayBuffer()
    if (body.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty file' },
        { status: 400 },
      )
    }
    if (body.byteLength > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds 60MB limit' },
        { status: 413 },
      )
    }

    const supabase = await createClient()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(OBJECT, body, {
        contentType,
        upsert: true,
      })

    if (uploadError) {
      console.error('[staff/upload-video] storage error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 502 },
      )
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(OBJECT)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      size: body.byteLength,
      contentType,
    })
  } catch (error) {
    console.error('[staff/upload-video] error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 },
    )
  }
}
