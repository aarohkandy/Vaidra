import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const language = searchParams.get('language')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    const where: any = {}

    if (category) {
      where.category = {
        name: category,
      }
    }

    if (language) {
      where.language = {
        code: language,
      }
    }

    if (level) {
      where.level = level
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleNative: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (featured) {
      where.featured = true
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true,
        language: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

