import { useMutation } from '@tanstack/react-query'
import api from '@/api/client'
import { LoginFormData, LoginResponse } from './types'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials)
      return data
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, accessToken, refreshToken)
        navigate('/dashboard')
      }
    },
  })
}

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSettled: () => {
      logoutStore()
      navigate('/login')
    },
  })
}
