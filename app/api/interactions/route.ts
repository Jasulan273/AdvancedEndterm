import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { interactionSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = interactionSchema.parse(body)

    const interaction = await prisma.interaction.create({
      data: {
        userId: user.userId,
        bookId: validatedData.bookId,
        type: validatedData.type
      }
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const interactions = await prisma.interaction.findMany({
      where: { userId: user.userId },
      include: { book: true },
      orderBy: { timestamp: 'desc' }
    })

    return NextResponse.json(interactions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    )
  }
}