import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { id } = await params
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
    })

    if (!audiobook) {
      return NextResponse.json(
        { error: 'Audiobook not found' },
        { status: 404 }
      )
    }

    // In a real application, you would stream the audio file from storage
    // For now, we'll return the URL
    return NextResponse.json({ audioUrl: audiobook.audioUrl })
  } catch (error) {
    console.error('Error fetching audio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audio' },
      { status: 500 }
    )
  }
}

