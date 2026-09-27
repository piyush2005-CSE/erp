import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { Faculty, CreateFacultyFormData } from './types'
import { PaginatedResponse } from '../students/types' // Reusing from students for now

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const useFacultyList = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['faculty', page, size],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Faculty>>>(`/faculty?page=${page}&size=${size}`)
      return data.data
    },
  })
}

export const useFaculty = (id: number) => {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Faculty>>(`/faculty/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export const useCreateFaculty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (facultyData: CreateFacultyFormData) => {
      const { data } = await api.post<ApiResponse<Faculty>>('/faculty', facultyData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] })
    },
  })
}
