import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import type { Student, PaginatedResponse, CreateStudentFormData } from './types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const useStudents = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['students', page, size],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Student>>>(`/students?page=${page}&size=${size}`)
      return data.data
    },
  })
}

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (studentData: CreateStudentFormData) => {
      const { data } = await api.post<ApiResponse<Student>>('/students', studentData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
