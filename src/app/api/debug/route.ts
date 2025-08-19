/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log to server console (sẽ hiển thị trong terminal)
    console.log('🔥 CLIENT DEBUG:', {
      message: body.message,
      data: body.data,
      timestamp: body.timestamp,
      url: body.url,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Failed to log debug info' }, { status: 500 })
  }
}
