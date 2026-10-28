import { useAuthStore } from '@/store/authStore'
import { useDashboardStats } from '@/api/hooks/useReports'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  GraduationCap,
  BookOpen,
  Building,
  CreditCard,
  FileCheck,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  Receipt,
  BellRing,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts'

const ATTENDANCE_TREND_DATA = [
  { month: 'Jun', attendance: 92, target: 85 },
  { month: 'Jul', attendance: 88, target: 85 },
  { month: 'Aug', attendance: 94, target: 85 },
  { month: 'Sep', attendance: 91, target: 85 },
  { month: 'Oct', attendance: 96, target: 85 },
  { month: 'Nov', attendance: 93, target: 85 },
]

const FEE_COLLECTION_DATA = [
  { month: 'Jun', collected: 45000, expected: 50000 },
  { month: 'Jul', collected: 52000, expected: 50000 },
  { month: 'Aug', collected: 48000, expected: 50000 },
  { month: 'Sep', collected: 61000, expected: 55000 },
  { month: 'Oct', collected: 58000, expected: 55000 },
  { month: 'Nov', collected: 64000, expected: 60000 },
]

export default function DashboardPage() {
  const { user, institutionType } = useAuthStore()
  const { data: stats, isLoading } = useDashboardStats()
  const navigate = useNavigate()
  const isSchool = institutionType === 'SCHOOL'

  const cards = [
    {
      title: isSchool ? 'Total Pupils' : 'Total Students',
      value: stats?.totalStudents || 0,
      subValue: `${stats?.activeStudents || 0} active`,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      bg: 'bg-blue-500/10',
      route: '/students',
    },
    {
      title: isSchool ? 'Total Teachers' : 'Total Faculty',
      value: stats?.totalFaculty || 0,
      subValue: `${stats?.activeFaculty || 0} active`,
      icon: <GraduationCap className="h-5 w-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
      route: '/faculty',
    },
    {
      title: isSchool ? 'Active Subjects' : 'Active Courses',
      value: stats?.activeCourses || 0,
      subValue: `out of ${stats?.totalCourses || 0} total`,
      icon: <BookOpen className="h-5 w-5 text-orange-500" />,
      bg: 'bg-orange-500/10',
      route: '/courses',
    },
    {
      title: isSchool ? 'School Wings' : 'Departments',
      value: stats?.totalDepartments || 0,
      subValue: isSchool ? 'Primary & Secondary' : 'Across campus',
      icon: <Building className="h-5 w-5 text-purple-500" />,
      bg: 'bg-purple-500/10',
      route: '/courses',
    },
    {
      title: 'Total Enrollments',
      value: stats?.totalEnrollments || 0,
      subValue: isSchool ? 'Current Term' : 'This semester',
      icon: <FileCheck className="h-5 w-5 text-indigo-500" />,
      bg: 'bg-indigo-500/10',
      route: '/enrollments',
    },
    {
      title: 'Pending Invoices',
      value: stats?.pendingInvoices || 0,
      subValue: `${stats?.paidInvoices || 0} paid`,
      icon: <CreditCard className="h-5 w-5 text-rose-500" />,
      bg: 'bg-rose-500/10',
      route: '/fees',
    },
    {
      title: 'Fees Collected',
      value: `$${(stats?.totalFeesCollected || 0).toLocaleString()}`,
      subValue: 'This academic year',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      bg: 'bg-green-500/10',
      route: '/fees',
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: isSchool ? 'Mid-Term Examinations' : 'End Semester Exams',
      date: 'Nov 12, 2026',
      time: '09:00 AM',
      tag: 'Academic',
      tagBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      id: 2,
      title: 'Fee Installment 2 Deadline',
      date: 'Nov 18, 2026',
      time: '11:59 PM',
      tag: 'Finance',
      tagBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    },
    {
      id: 3,
      title: isSchool ? 'Parent-Teacher Meeting (PTM)' : 'Faculty Senate Meeting',
      date: 'Nov 22, 2026',
      time: '02:30 PM',
      tag: 'Event',
      tagBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    },
  ]

  const recentNotices = [
    {
      id: 1,
      title: 'Winter Semester Registration Open',
      desc: 'All eligible students can submit their course preferences online.',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Library Hours Extended',
      desc: 'Central library will remain open until 10 PM during exam weeks.',
      time: '1 day ago',
    },
    {
      id: 3,
      title: 'New Campus Bus Route (Route 14)',
      desc: 'Transit service added covering South District starting Monday.',
      time: '2 days ago',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              <span>{isSchool ? 'K-12 School Edition' : 'Higher Education Campus ERP'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.firstName || 'Administrator'}!
            </h1>
            <p className="text-white/80 text-sm max-w-xl">
              Here is what is happening across your {isSchool ? 'school campus' : 'university'} today. All systems operational.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate('/students')}
              size="sm"
              className="bg-white text-brand-900 hover:bg-white/90 shadow-sm font-medium"
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Add {isSchool ? 'Pupil' : 'Student'}
            </Button>
            <Button
              onClick={() => navigate('/attendance')}
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <CalendarCheck className="mr-1.5 h-4 w-4" />
              Attendance
            </Button>
            <Button
              onClick={() => navigate('/fees')}
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Receipt className="mr-1.5 h-4 w-4" />
              Invoice
            </Button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.route)}
            className="cursor-pointer rounded-xl border border-border bg-card text-card-foreground p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between space-y-0 pb-3">
              <h3 className="tracking-tight text-xs font-medium text-muted-foreground">
                {card.title}
              </h3>
              <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl sm:text-3xl font-bold flex items-center justify-between">
                <span>{isLoading ? '—' : card.value}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground">{card.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Attendance Rate Trends (%)</h2>
              <p className="text-xs text-muted-foreground">Monthly average attendance across all grades</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Avg 92.3%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Fee Collections vs Target ($)</h2>
              <p className="text-xs text-muted-foreground">Monthly fee receipts vs anticipated collections</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              On Track
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEE_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                />
                <Bar dataKey="expected" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Expected" />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two-Column Events and Notices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Academic Schedule */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-semibold">Upcoming Schedule & Milestones</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/exams')} className="text-xs">
              View all
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${evt.tagBg}`}>
                      {evt.tag}
                    </span>
                    <h3 className="text-sm font-medium text-foreground">{evt.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {evt.time}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notices and Broadcasts */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-semibold">Recent Announcements</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')} className="text-xs">
              View center
            </Button>
          </div>

          <div className="space-y-3">
            {recentNotices.map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{notice.title}</h3>
                  <span className="text-[11px] text-muted-foreground">{notice.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notice.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
