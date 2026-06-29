import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to check staff session cookie
 */
export function withStaffAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const staffSession = request.cookies.get('staff_session')?.value

    if (!staffSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request)
  }
}

/**
 * Extract staff session ID from request
 */
export function getStaffSessionId(request: NextRequest): string | null {
  return request.cookies.get('staff_session')?.value || null
}
