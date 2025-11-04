import { NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/recommendations'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const recommendations = await getRecommendations(userId)
    return NextResponse.json(recommendations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}