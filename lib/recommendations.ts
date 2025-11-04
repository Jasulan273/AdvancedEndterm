import { prisma } from './prisma'

export async function getRecommendations(userId: string, limit: number = 10) {
  const userInteractions = await prisma.interaction.findMany({
    where: { userId },
    include: { book: true }
  })

  if (userInteractions.length === 0) {
    const popularBooks = await prisma.book.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
    return popularBooks
  }

  const userBookIds = userInteractions.map(i => i.bookId)
  const userGenres = [...new Set(userInteractions.map(i => i.book.genre))]

  const similarUsers = await prisma.interaction.findMany({
    where: {
      bookId: { in: userBookIds },
      userId: { not: userId }
    },
    select: { userId: true },
    distinct: ['userId']
  })

  const similarUserIds = similarUsers.map(u => u.userId)

  if (similarUserIds.length === 0) {
    const genreBooks = await prisma.book.findMany({
      where: {
        genre: { in: userGenres },
        id: { notIn: userBookIds }
      },
      take: limit
    })
    return genreBooks
  }

  const recommendations = await prisma.interaction.findMany({
    where: {
      userId: { in: similarUserIds },
      bookId: { notIn: userBookIds }
    },
    include: { book: true },
    distinct: ['bookId'],
    take: limit,
    orderBy: { timestamp: 'desc' }
  })

  return recommendations.map(r => r.book)
}