import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/features/auth/types'
import type { LoginFormData } from '@/features/auth/types'
import { useLogin } from '@/features/auth/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [institutionType, setInstitutionType] = useState<'SCHOOL' | 'COLLEGE'>('COLLEGE')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      institutionType: 'COLLEGE'
    }
  })

  const loginMutation = useLogin()

  const onSubmit = (data: LoginFormData) => {
    // Override form data with selected tab just in case
    data.institutionType = institutionType
    loginMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg ring-1 ring-border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Campus ERP</h2>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        {/* Custom Toggle for Institution Type */}
        <div className="flex p-1 bg-muted rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              institutionType === 'SCHOOL'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setInstitutionType('SCHOOL')}
          >
            School
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              institutionType === 'COLLEGE'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setInstitutionType('COLLEGE')}
          >
            College
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register('institutionType')} value={institutionType} />
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm font-medium text-brand-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : `Sign in to ${institutionType === 'SCHOOL' ? 'School' : 'College'}`}
          </Button>

          {loginMutation.isError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {loginMutation.error instanceof Error 
                ? loginMutation.error.message 
                : 'Invalid credentials. Please try again.'}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
