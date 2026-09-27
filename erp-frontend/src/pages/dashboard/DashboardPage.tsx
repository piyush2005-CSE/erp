import { useAuthStore } from '@/store/authStore'
import { useDashboardStats } from '@/api/hooks/useReports'
import {
  Users,
  GraduationCap,
  BookOpen,
  Building,
  CreditCard,
  FileCheck,
  TrendingUp,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading dashboard. Ensure you have the required permissions.
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      subValue: `${stats?.activeStudents || 0} active`,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Faculty',
      value: stats?.totalFaculty || 0,
      subValue: `${stats?.activeFaculty || 0} active`,
      icon: <GraduationCap className="h-5 w-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      subValue: `out of ${stats?.totalCourses || 0} total`,
      icon: <BookOpen className="h-5 w-5 text-orange-500" />,
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 0,
      subValue: 'Across campus',
      icon: <Building className="h-5 w-5 text-purple-500" />,
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Total Enrollments',
      value: stats?.totalEnrollments || 0,
      subValue: 'This semester',
      icon: <FileCheck className="h-5 w-5 text-indigo-500" />,
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Pending Invoices',
      value: stats?.pendingInvoices || 0,
      subValue: `${stats?.paidInvoices || 0} paid`,
      icon: <CreditCard className="h-5 w-5 text-rose-500" />,
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Fees Collected',
      value: `$${(stats?.totalFeesCollected || 0).toLocaleString()}`,
      subValue: 'This academic year',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      bg: 'bg-green-500/10',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          Here is what's happening with your campus today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
              <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
            </div>
            <div className="p-6 pt-2 flex flex-col gap-1">
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.subValue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
