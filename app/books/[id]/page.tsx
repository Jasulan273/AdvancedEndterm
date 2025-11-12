"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, Star, ArrowLeft, Loader2, Calendar, Hash, CheckCircle2 } from 'lucide-react'
import BookCover from '@/components/BookCover'
import { toast } from "sonner"

interface Book {
  id: string
  title: string
  author: string
  genre: string
  price: number
  description: string
  tags?: string[]
  isbn?: string
  publishYear?: number
}

interface UserInteractions {
  hasLiked: boolean
  hasPurchased: boolean
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [viewLogged, setViewLogged] = useState(false)
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    hasLiked: false,
    hasPurchased: false
  })
  const [likesCount, setLikesCount] = useState(0)
  const [purchasesCount, setPurchasesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)

  useEffect(() => {
    fetchBook()
    fetchStats()
    if (isAuthenticated) {
      checkUserInteractions()
    }
  }, [params.id, isAuthenticated])

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBook(data)
    } catch (err) {
      console.error('Failed to fetch book:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/books/${params.id}/stats`)
      if (res.ok) {
        const data = await res.json()
        setLikesCount(data.likes || 0)
        setPurchasesCount(data.purchases || 0)
        setViewsCount(data.views || 0)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const checkUserInteractions = async () => {
    try {
      const res = await fetch(`/api/interactions/check/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setUserInteractions(data)
      }
    } catch (err) {
      console.error('Failed to check interactions:', err)
    }
  }

  const handleInteraction = async (type: 'view' | 'like' | 'purchase') => {
    if (!isAuthenticated) {
      toast.error('Please login to continue', {
        description: 'You need to be logged in to interact with books'
      })
      router.push('/login')
      return
    }

    // Проверка на повторные действия
    if (type === 'like' && userInteractions.hasLiked) {
      toast.info('Already liked', {
        description: 'You have already liked this book'
      })
      return
    }

    if (type === 'purchase' && userInteractions.hasPurchased) {
      toast.info('Already purchased', {
        description: 'You have already purchased this book'
      })
      return
    }

    setInteracting(true)
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: params.id,
          type
        })
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          // Конфликт - уже существует
          toast.info('Already interacted', {
            description: data.error
          })
        } else {
          toast.error('Action failed', {
            description: data.error || 'Something went wrong'
          })
        }
        return
      }

      // Успешно!
      if (type === 'like') {
        setLikesCount(prev => prev + 1)
        setUserInteractions(prev => ({ ...prev, hasLiked: true }))
        toast.success('Book liked! ❤️', {
          description: `You liked "${book?.title}"`,
          icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        })
      } else if (type === 'purchase') {
        setPurchasesCount(prev => prev + 1)
        setUserInteractions(prev => ({ ...prev, hasPurchased: true }))
        toast.success('Purchase successful! 🎉', {
          description: `"${book?.title}" has been added to your library`,
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        })
      }
    } catch (err) {
      console.error('Interaction failed:', err)
      toast.error('Something went wrong', {
        description: 'Please try again later'
      })
    } finally {
      setInteracting(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && book && !viewLogged) {
      handleInteraction('view')
      setViewsCount(prev => prev + 1)
      setViewLogged(true)
    }
  }, [book, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <Header />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Book not found</h2>
          <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/books')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <Header />
      
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/books')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden sticky top-24">
              <BookCover
                title={book.title}
                author={book.author}
                isbn={book.isbn}
                className="aspect-2/3"
              />
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className={userInteractions.hasLiked ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4"} />
                    <span>{likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ShoppingCart className={userInteractions.hasPurchased ? "h-4 w-4 text-green-500" : "h-4 w-4"} />
                    <span>{purchasesCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{viewsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{book.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xl text-muted-foreground">by {book.author}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  {book.genre}
                </Badge>
                {book.publishYear && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {book.publishYear}
                  </Badge>
                )}
                {book.isbn && (
                  <Badge variant="outline" className="gap-1">
                    <Hash className="h-3 w-3" />
                    {book.isbn}
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-bold text-primary">${book.price}</span>
                <span className="text-muted-foreground">USD</span>
              </div>

              <div className="flex gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={() => handleInteraction('purchase')}
                  disabled={interacting || !isAuthenticated || userInteractions.hasPurchased}
                  className="flex-1 gap-2"
                >
                  {userInteractions.hasPurchased ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Purchased
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {isAuthenticated ? 'Purchase Now' : 'Login to Purchase'}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant={userInteractions.hasLiked ? "default" : "outline"}
                  onClick={() => handleInteraction('like')}
                  disabled={interacting || !isAuthenticated || userInteractions.hasLiked}
                  className="gap-2"
                >
                  <Heart className={userInteractions.hasLiked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                  {userInteractions.hasLiked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </CardContent>
            </Card>

            {book.tags && book.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}