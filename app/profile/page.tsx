"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ShoppingCart,
  Heart,
  Eye,
  TrendingUp,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import BookCover from "@/components/BookCover";

interface Interaction {
  id: string;
  type: string;
  timestamp: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
  };
}

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  description: string;
  publishYear?: number;
  isbn?: string;
}
export default function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [interactionsRes, recommendationsRes] = await Promise.all([
        fetch("/api/interactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/recommendations/${user?.id}`),
      ]);

      const interactionsData = await interactionsRes.json();
      const recommendationsData = await recommendationsRes.json();

      setInteractions(interactionsData);
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const purchases = interactions.filter((i) => i.type === "purchase");
  const likes = interactions.filter((i) => i.type === "like");
  const views = interactions.filter((i) => i.type === "view");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <Header />

      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user?.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchases</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {purchases.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Books purchased
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Liked Books
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {likes.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Books you loved
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {views.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Books explored
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>Recommended for You</CardTitle>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  AI Powered
                </Badge>
              </div>
              <CardDescription>
                Based on your reading history and preferences
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No recommendations yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Interact with more books to get personalized recommendations
                  </p>
                  <Link href="/books">
                    <Button>Browse Books</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((book) => (
                    <Link key={book.id} href={`/books/${book.id}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group h-full">
                        <div className="relative aspect-2/3 overflow-hidden bg-muted">
                          <BookCover
                            title={book.title}
                            author={book.author}
                            isbn={book.isbn}
                            className="aspect-2/3 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                            {book.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-1">
                            {book.author}
                          </CardDescription>
                        </CardHeader>

                        <CardFooter className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">
                            ${book.price}
                          </span>
                          <Badge variant="outline">{book.genre}</Badge>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <CardTitle>Purchase History</CardTitle>
              </div>
              <CardDescription>
                Your collection of {purchases.length} books
              </CardDescription>
            </CardHeader>

            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No purchases yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your library today
                  </p>
                  <Link href="/books">
                    <Button className="gap-2">
                      Browse Books
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((interaction) => (
                    <Link
                      key={interaction.id}
                      href={`/books/${interaction.book.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div>
                          <h4 className="font-semibold hover:text-primary transition-colors">
                            {interaction.book.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {interaction.book.author}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            ${interaction.book.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              interaction.timestamp
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
