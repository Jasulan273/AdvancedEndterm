import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(6).max(100)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const bookSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  genre: z.string().min(1).max(50),
  price: z.number().positive(),
  description: z.string().min(10).max(2000),
  cover: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  isbn: z.string().optional(),
  publishYear: z.number().int().min(1000).max(new Date().getFullYear()).optional()
})

export const interactionSchema = z.object({
  bookId: z.string(),
  type: z.enum(['view', 'like', 'purchase'])
})