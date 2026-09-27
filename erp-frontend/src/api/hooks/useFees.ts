import { useQuery } from '@tanstack/react-query'
import api from '../client'

export const useInvoices = (academicYear?: string, status?: string) => {
  return useQuery({
    queryKey: ['invoices', academicYear, status],
    queryFn: async () => {
      const res = await api.get('/fees/invoices', {
        params: { academicYear, status },
      })
      return res.data.data
    },
  })
}

export const useStudentInvoices = (studentId?: number) => {
  return useQuery({
    queryKey: ['invoices', 'student', studentId],
    queryFn: async () => {
      const res = await api.get(`/fees/invoices/student/${studentId}`)
      return res.data.data
    },
    enabled: !!studentId,
  })
}
