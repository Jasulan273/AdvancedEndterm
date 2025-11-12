import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight, Star, TrendingUp } from 'lucide-react'
import BookCover from '@/components/BookCover'

async function getBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, {
    cache: 'no-store'
  })
  
  if (!res.ok) return []
  return res.json()
}

export default async function Home() {
  const books = await getBooks()
  const featuredBooks = books.slice(0, 6)

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <Header />
      
      <main>
        <section className="container py-20 md:py-28">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="mr-2 h-3 w-3" />
              #1 Online Bookstore
            </Badge>
            
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Discover Your Next
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Favorite Book</span>
            </h1>
            
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Explore thousands of books with personalized recommendations powered by MongoDB. 
              Find, read, and fall in love with stories that matter.
            </p>
            
            <div className="flex gap-4 mt-4">
              <Link href="/books">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse Books
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Books</h2>
              <p className="text-muted-foreground mt-2">Handpicked bestsellers and classics</p>
            </div>
            <Link href="/books">
              <Button variant="ghost" className="gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book: any) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group h-full">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    isbn={book.isbn}
                    className="aspect-2/3 group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{book.genre}</Badge>
                      {book.publishYear && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          {book.publishYear}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      by {book.author}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl font-bold text-primary">
                        ${book.price}
                      </span>
                      <Button size="sm" variant="ghost" className="gap-2">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="container py-20 bg-muted/30 rounded-3xl my-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">10,000+ Books</h3>
              <p className="text-muted-foreground text-sm">Vast collection across all genres</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">MongoDB Recommendations</h3>
              <p className="text-muted-foreground text-sm">Personalized suggestions just for you</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Community Driven</h3>
              <p className="text-muted-foreground text-sm">Join thousands of book lovers</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}