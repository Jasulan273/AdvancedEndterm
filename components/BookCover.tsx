"use client"

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookCoverProps {
  title: string
  author: string
  isbn?: string
  className?: string
}

export default function BookCover({ title, author, isbn, className }: BookCoverProps) {
  const [imageError, setImageError] = useState(false)
  
  const coverUrl = isbn 
    ? `https://covers.openlibrary.org/b/isbn/${isbn.replace(/-/g, '')}-L.jpg`
    : null

  const linears = [
    'from-blue-500 via-blue-600 to-purple-600',
    'from-green-500 via-teal-600 to-cyan-600',
    'from-orange-500 via-red-500 to-pink-600',
    'from-pink-500 via-rose-500 to-red-600',
    'from-indigo-500 via-purple-600 to-pink-600',
    'from-amber-500 via-orange-600 to-red-600',
    'from-cyan-500 via-blue-600 to-indigo-600',
    'from-fuchsia-500 via-purple-600 to-indigo-600',
  ]
  
  const linear = linears[title.charCodeAt(0) % linears.length]

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {coverUrl && !imageError ? (
        <>
          <img
            src={coverUrl}
            alt={title}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
          <div className={cn(
            "absolute inset-0 bg-linear-to-br flex flex-col items-center justify-center p-6 text-white opacity-0 transition-opacity",
            linear
          )}>
            <BookOpen className="h-16 w-16 mb-4 opacity-80" />
            <h3 className="font-bold text-center text-xl line-clamp-4 mb-2">{title}</h3>
            <p className="text-sm opacity-90 text-center line-clamp-2">{author}</p>
          </div>
        </>
      ) : (
        <div className={cn(
          "absolute inset-0 bg-linear-to-br flex flex-col items-center justify-center p-6 text-white",
          linear
        )}>
          <BookOpen className="h-16 w-16 mb-4 opacity-80" />
          <h3 className="font-bold text-center text-xl line-clamp-4 mb-2">{title}</h3>
          <p className="text-sm opacity-90 text-center line-clamp-2">{author}</p>
        </div>
      )}
    </div>
  )
}