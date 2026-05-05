import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        'Username can only contain letters, numbers, dots, underscores, and hyphens',
      ),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const searchSchema = z
  .object({
    redirect: z.string().optional().default('/dashboard'),
    logout: z.string().optional(),
  })
  .transform((data) => {
    const { logout, ...rest } = data
    return rest
  })
