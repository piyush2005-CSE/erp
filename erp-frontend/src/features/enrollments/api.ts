import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import type { Enrollment, CreateEnrollmentFormData } from './types'
import type { PaginatedResponse } from '../students/types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const useEnrollments = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['enrollments', page, size],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Enrollment>>>(`/enrollments?page=${page}&size=${size}`)
      return data.data
    },
  })
}

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (enrollmentData: CreateEnrollmentFormData) => {
      const { data } = await api.post<ApiResponse<Enrollment>>('/enrollments', enrollmentData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}
