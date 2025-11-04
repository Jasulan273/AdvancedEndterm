export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  price: number
  description: string
  cover?: string
  tags: string[]
  isbn?: string
  publishYear?: number
  createdAt: Date
}

export interface Interaction {
  id: string
  userId: string
  bookId: string
  type: 'view' | 'like' | 'purchase'
  timestamp: Date
}

export interface RegisterData {
  email: string
  name: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}