import { useState, useMemo } from 'react'
import { useEnrollments, useCreateEnrollment } from '@/features/enrollments/api'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  X,
  ChevronDown,
  GraduationCap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'

export default function EnrollmentsPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const { data, isLoading, isError } = useEnrollments(page, 15)
  const createEnrollmentMutation = useCreateEnrollment()

  const [formData, setFormData] = useState({
    studentId: 1,
    courseId: 1,
    semesterId: 1,
  })
  const [formError, setFormError] = useState('')

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    try {
      await createEnrollmentMutation.mutateAsync({
        studentId: Number(formData.studentId),
        courseId: Number(formData.courseId),
        semesterId: Number(formData.semesterId),
      })
      setIsModalOpen(false)
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create enrollment.')
    }
  }

  const filteredEnrollments = useMemo(() => {
    if (!data?.content) return []
    return data.content.filter((enrollment) => {
      const matchesSearch =
        !search ||
        enrollment.studentName.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.courseCode.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'ALL' || enrollment.status.toUpperCase() === statusFilter.toUpperCase()
      return matchesSearch && matchesStatus
    })
  }, [data?.content, search, statusFilter])

  const totalEnrollments = data?.totalElements || data?.content?.length || 0
  const activeCount = data?.content?.filter((e) => e.status === 'ENROLLED').length || 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrollments</h1>
          <p className="text-muted-foreground mt-1">
            Manage student course registrations and {isSchool ? 'subject' : 'academic'} enrollments.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Enrollment
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Enrollments',
            value: totalEnrollments,
            icon: <Users className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Active Confirmed',
            value: activeCount,
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: isSchool ? 'Subjects Active' : 'Courses Covered',
            value: '24 Modules',
            icon: <BookOpen className="h-4 w-4 text-purple-500" />,
            bg: 'bg-purple-500/10',
          },
          {
            label: isSchool ? 'Academic Session' : 'Current Term',
            value: '2026 - 2027',
            icon: <GraduationCap className="h-4 w-4 text-orange-500" />,
            bg: 'bg-orange-500/10',
          },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border shadow-sm flex-1 min-w-[240px] max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder={`Search by student, ${isSchool ? 'subject' : 'course'}, or roll #...`}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="appearance-none pl-3 pr-9 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ENROLLED">Enrolled</option>
            <option value="PENDING">Pending</option>
            <option value="DROPPED">Dropped</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Subject' : 'Course'}</th>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Term' : 'Semester'}</th>
                <th className="px-6 py-4 font-medium">Enrollment Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      <p>Loading enrollments...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-destructive">
                    Failed to load enrollments. Please check backend service.
                  </td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-brand-100/50 flex items-center justify-center">
                        <Users className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="font-medium text-foreground">No enrollments found</p>
                      <p className="text-muted-foreground text-xs max-w-xs">
                        Start registering students into active {isSchool ? 'subjects' : 'courses'}.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-1 bg-brand-600 hover:bg-brand-700"
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        New Enrollment
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{enrollment.studentName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{enrollment.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{enrollment.courseTitle}</div>
                      <div className="text-xs text-muted-foreground font-mono">{enrollment.courseCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                        {enrollment.semesterName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {enrollment.enrollmentDate
                        ? new Date(enrollment.enrollmentDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {enrollment.status === 'ENROLLED' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" /> Enrolled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                          <Clock className="mr-1 h-3 w-3" /> {enrollment.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing page {data ? page + 1 : 0} of {data?.totalPages || 1}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data ? page >= data.totalPages - 1 : true}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* New Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">New Student Enrollment</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEnrollment} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium">Student ID *</label>
                <Input
                  type="number"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })}
                  placeholder="Student ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{isSchool ? 'Subject ID *' : 'Course ID *'}</label>
                <Input
                  type="number"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                  placeholder="Course ID"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{isSchool ? 'Term / Term ID *' : 'Semester ID *'}</label>
                <Input
                  type="number"
                  required
                  value={formData.semesterId}
                  onChange={(e) => setFormData({ ...formData, semesterId: Number(e.target.value) })}
                  placeholder="Semester ID"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700"
                  disabled={createEnrollmentMutation.isPending}
                >
                  {createEnrollmentMutation.isPending ? 'Enrolling...' : 'Confirm Enrollment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
