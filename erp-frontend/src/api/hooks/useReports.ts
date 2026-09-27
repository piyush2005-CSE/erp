import { useQuery } from '@tanstack/react-query'
import api from '../client'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/reports/dashboard')
      return res.data.data
    },
  })
}
