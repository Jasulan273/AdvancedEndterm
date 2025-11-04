import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const interactions = await prisma.interaction.findMany({
      where: { bookId: id }
    })

    const likes = interactions.filter(i => i.type === 'like').length
    const purchases = interactions.filter(i => i.type === 'purchase').length
    const views = interactions.filter(i => i.type === 'view').length

    return NextResponse.json({
      likes,
      purchases,
      views,
      total: interactions.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}