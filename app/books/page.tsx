"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Loader2 } from 'lucide-react'
import BookCover from '@/components/BookCover'

interface Book {
  id: string
  title: string
  author: string
  genre: string
  price: number
  description: string
  publishYear?: number
  isbn?: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedGenre) params.append('genre', selectedGenre)

      const res = await fetch(`/api/books?${params}`)
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      console.error('Failed to fetch books:', err)
    } finally {
      setLoading(false)
    }
  }

  const genres = [...new Set(books.map(b => b.genre))]

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchBooks()
    }, 300)
    return () => clearTimeout(debounce)
  }, [search, selectedGenre])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <Header />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Explore our collection of {books.length} amazing books
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            {(search || selectedGenre) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  setSelectedGenre('')
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {books.map((book) => (
              <motion.div key={book.id} variants={item}>
                <Link href={`/books/${book.id}`}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group h-full">
                    <div className="relative aspect-2/3 overflow-hidden bg-muted">
                    <BookCover
  title={book.title}
  author={book.author}
  isbn={book.isbn}
  className="aspect-2/3 group-hover:scale-105 transition-transform duration-300"
/>
                      {book.publishYear && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                            {book.publishYear}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        by {book.author}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <Badge variant="outline">{book.genre}</Badge>
                    </CardContent>
                    
                    <CardFooter>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl font-bold text-primary">
                          ${book.price}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}