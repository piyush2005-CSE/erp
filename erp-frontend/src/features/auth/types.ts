import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  institutionType: z.enum(['SCHOOL', 'COLLEGE']),
})

export type LoginFormData = z.infer<typeof loginSchema>

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: number
      username: string
      email: string
      firstName: string
      lastName: string
      avatarUrl?: string
      institutionType: string
      roles: string[]
      permissions: string[]
    }
  }
}
