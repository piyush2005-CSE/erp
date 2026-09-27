import { useQuery } from '@tanstack/react-query'
import api from '../client'

export const useAttendanceSessions = (courseId?: number, semesterId?: number) => {
  return useQuery({
    queryKey: ['attendance-sessions', courseId, semesterId],
    queryFn: async () => {
      const res = await api.get('/attendance/sessions', {
        params: { courseId, semesterId },
      })
      return res.data.data
    },
    enabled: !!courseId && !!semesterId,
  })
}

export const useAttendanceSummary = (studentId?: number, courseId?: number) => {
  return useQuery({
    queryKey: ['attendance-summary', studentId, courseId],
    queryFn: async () => {
      const res = await api.get('/attendance/summary', {
        params: { studentId, courseId },
      })
      return res.data.data
    },
    enabled: !!studentId && !!courseId,
  })
}
