import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const author = searchParams.get('author')
    const search = searchParams.get('search')

    const where: any = {}

    if (genre) {
      where.genre = genre
    }

    if (author) {
      where.author = { contains: author, mode: 'insensitive' }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = bookSchema.parse(body)

    const book = await prisma.book.create({
      data: validatedData
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}