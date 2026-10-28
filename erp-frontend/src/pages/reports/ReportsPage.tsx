import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  CreditCard,
  Download,
  CheckCircle,
  PieChart as PieIcon,
  X
} from 'lucide-react'
import { useDashboardStats } from '@/api/hooks/useReports'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

const DEPARTMENT_PERFORMANCE_DATA = [
  { name: 'Computer Science', averageScore: 84, passRate: 96 },
  { name: 'Mechanical Eng.', averageScore: 78, passRate: 91 },
  { name: 'Civil Engineering', averageScore: 76, passRate: 88 },
  { name: 'Electrical Eng.', averageScore: 81, passRate: 94 },
  { name: 'Business Admin', averageScore: 86, passRate: 98 },
]

const REVENUE_BREAKDOWN = [
  { name: 'Tuition Fees', value: 65, color: '#3b82f6' },
  { name: 'Lab & Library', value: 15, color: '#10b981' },
  { name: 'Hostel Charges', value: 12, color: '#f59e0b' },
  { name: 'Transport Bus', value: 8, color: '#8b5cf6' },
]

export default function ReportsPage() {
  const { data: stats, isLoading } = useDashboardStats()
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleExport = (reportName: string) => {
    // Generate simulated CSV export
    const csvContent =
      'data:text/csv;charset=utf-8,Metric,Value,Date\n' +
      `Total Students,${stats?.totalStudents || 120},${new Date().toISOString()}\n` +
      `Total Faculty,${stats?.totalFaculty || 18},${new Date().toISOString()}\n` +
      `Tuition Collected,$${stats?.totalFeesCollected || 54000},${new Date().toISOString()}\n`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}_2026.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const reports = [
    {
      title: 'Attendance Report',
      desc: isSchool ? 'Weekly & monthly pupil attendance metrics by class.' : 'Monthly attendance trends by course or academic department.',
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      bg: 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40',
      dataDetails: 'High average attendance across high school wings (93.4%). Lowest attendance observed in 8th Grade Term 1.',
    },
    {
      title: 'Fee Collection Report',
      desc: 'Revenue breakdown, pending installments, and overdue receivables.',
      icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40',
      dataDetails: `$${(stats?.totalFeesCollected || 0).toLocaleString()} collected year-to-date with ${stats?.pendingInvoices || 0} invoices currently outstanding.`,
    },
    {
      title: 'Student Performance & Grades',
      desc: 'Grade distribution, pass/fail ratios, and standardized examination stats.',
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      bg: 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40',
      dataDetails: 'Overall pass rate: 94.2%. 28% of students earned Grade A or higher this semester.',
    },
    {
      title: 'Enrollment Summary',
      desc: isSchool ? 'Standard-wise student enrollment demographics.' : 'Enrollment statistics by major program and semester intake.',
      icon: <Users className="h-5 w-5 text-orange-600" />,
      bg: 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40',
      dataDetails: `${stats?.totalEnrollments || 0} active subject registrations across all registered batches.`,
    },
    {
      title: isSchool ? 'Teacher Workload' : 'Faculty Workload',
      desc: isSchool ? 'Subject periods and class teaching assignments.' : 'Teaching credit hours, lab oversight, and research supervision.',
      icon: <BookOpen className="h-5 w-5 text-rose-600" />,
      bg: 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40',
      dataDetails: 'Average 16 contact hours per week per instructor. Zero unassigned subjects.',
    },
    {
      title: 'Facility & Fleet Utilization',
      desc: 'Library circulation rates, hostel bed occupancy, and transport capacity.',
      icon: <PieIcon className="h-5 w-5 text-indigo-600" />,
      bg: 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40',
      dataDetails: 'Hostel occupancy at 82%, transit buses operating at 88% seat capacity.',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytical Insights</h1>
          <p className="text-muted-foreground mt-1">
            Institutional metrics and data summaries for {isSchool ? 'K-12 school' : 'college'} leadership.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {downloadSuccess && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
              <CheckCircle className="h-3.5 w-3.5" /> CSV Exported!
            </span>
          )}
          <Button
            onClick={() => handleExport('Institutional_Overview_Report')}
            className="bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export Overview (CSV)
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: isSchool ? 'Total Pupils' : 'Total Students',
            value: stats?.totalStudents ?? 0,
            icon: <Users className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: isSchool ? 'Teachers & Staff' : 'Faculty',
            value: stats?.totalFaculty ?? 0,
            icon: <Users className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: isSchool ? 'Active Subjects' : 'Active Courses',
            value: stats?.totalCourses ?? 0,
            icon: <BookOpen className="h-4 w-4 text-purple-500" />,
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Total Fees Collected',
            value: `$${(stats?.totalFeesCollected ?? 0).toLocaleString()}`,
            icon: <CreditCard className="h-4 w-4 text-orange-500" />,
            bg: 'bg-orange-500/10',
          },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{isLoading ? '—' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department/Wing Performance Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Academic Performance by Department</h2>
              <p className="text-xs text-muted-foreground">Average examination score (%) vs Pass percentage</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              AY 2026-2027
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Score (%)" />
                <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold">Revenue Composition</h2>
            <p className="text-xs text-muted-foreground">Percentage contribution by fee category</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REVENUE_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Comprehensive Report Portfolios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <div
              key={i}
              onClick={() => setSelectedReport(report.title)}
              className={`rounded-2xl border p-5 text-left hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between ${report.bg}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-black/30 shadow-sm shrink-0">
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{report.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40 text-xs">
                <span className="font-medium text-brand-600 hover:underline">View Breakdown ➔</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleExport(report.title)
                  }}
                  className="text-muted-foreground hover:text-foreground p-1"
                  title="Export this report"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">{selectedReport}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                {reports.find((r) => r.title === selectedReport)?.dataDetails}
              </p>

              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Reporting Period:</span>
                  <span className="font-medium">Academic Year 2026-2027</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Data Timestamp:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Audited By:</span>
                  <span className="font-medium">Institutional Comptroller</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleExport(selectedReport)
                    setSelectedReport(null)
                  }}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Download Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
