import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json([])
    }
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const language = searchParams.get('language')
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

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (featured) {
      where.featured = true
    }

    const researchPapers = await prisma.researchPaper.findMany({
      where,
      include: {
        category: true,
        language: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(researchPapers)
  } catch (error) {
    console.error('Error fetching research papers:', error)
    return NextResponse.json([])
  }
}

