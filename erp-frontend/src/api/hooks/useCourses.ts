import { useQuery } from '@tanstack/react-query'
import api from '../client'

export const useCourses = (search?: string) => {
  return useQuery({
    queryKey: ['courses', search],
    queryFn: async () => {
      const res = await api.get('/courses', { params: { search } })
      return res.data.data
    },
  })
}

export const useCourse = (id: number) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`)
      return res.data.data
    },
  })
}

export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const res = await api.get('/semesters')
      return res.data.data
    },
  })
}
