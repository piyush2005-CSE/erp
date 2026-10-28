import { useState, useMemo } from 'react'
import { useStudents, useCreateStudent } from '@/features/students/api'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  GraduationCap,
  UserCheck,
  X,
  CheckCircle,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'

export default function StudentListPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const { data, isLoading, isError } = useStudents(page, 15)
  const createStudentMutation = useCreateStudent()

  // New Student Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    departmentId: 1,
    programId: 1,
    batchYear: new Date().getFullYear(),
    admissionDate: new Date().toISOString().split('T')[0],
    phone: '',
    gender: 'MALE',
  })
  const [formError, setFormError] = useState('')

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.rollNumber) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError('')
    try {
      await createStudentMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        rollNumber: formData.rollNumber,
        departmentId: Number(formData.departmentId),
        programId: Number(formData.programId),
        batchYear: Number(formData.batchYear),
        admissionDate: formData.admissionDate,
        phone: formData.phone || undefined,
        gender: formData.gender,
      })
      setIsAddModalOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        rollNumber: '',
        departmentId: 1,
        programId: 1,
        batchYear: new Date().getFullYear(),
        admissionDate: new Date().toISOString().split('T')[0],
        phone: '',
        gender: 'MALE',
      })
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create student.')
    }
  }

  // Filter students by search and status
  const filteredStudents = useMemo(() => {
    if (!data?.content) return []
    return data.content.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      const matchesSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'ALL' || student.status.toUpperCase() === statusFilter.toUpperCase()
      return matchesSearch && matchesStatus
    })
  }, [data?.content, search, statusFilter])

  const totalStudents = data?.totalElements || data?.content?.length || 0
  const activeCount = data?.content?.filter((s) => s.status === 'ACTIVE').length || 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSchool ? 'Students & Pupils' : 'Students'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage {isSchool ? 'school pupil' : 'student'} records, enrollment tracks, and academic status.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {isSchool ? 'Pupil' : 'Student'}
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: isSchool ? 'Total Pupils' : 'Total Students',
            value: totalStudents,
            icon: <Users className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Active Enrollment',
            value: activeCount,
            icon: <UserCheck className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-500/10',
          },
          {
            label: isSchool ? 'Current Grades' : 'Programs Enrolled',
            value: isSchool ? '12 Standards' : 'Undergrad & PG',
            icon: <GraduationCap className="h-4 w-4 text-purple-500" />,
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Avg. Attendance',
            value: '91.4%',
            icon: <CheckCircle className="h-4 w-4 text-orange-500" />,
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

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border shadow-sm flex-1 min-w-[240px] max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder={`Search by name, ${isSchool ? 'admission' : 'roll'} #...`}
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="GRADUATED">Graduated</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Pupil' : 'Student'} Info</th>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Admission #' : 'Roll Number'}</th>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Grade / Class' : 'Program'}</th>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Term' : 'Semester'}</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      <p>Loading {isSchool ? 'pupil' : 'student'} records...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-destructive">
                    Failed to load students. Please check your backend connection.
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-brand-100/50 flex items-center justify-center">
                        <Users className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="font-medium text-foreground">No students found</p>
                      <p className="text-muted-foreground text-xs max-w-xs">
                        {search || statusFilter !== 'ALL'
                          ? 'Try adjusting your search criteria or filters.'
                          : 'Get started by enrolling new students into the system.'}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-1 bg-brand-600 hover:bg-brand-700"
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add {isSchool ? 'Pupil' : 'Student'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || 'ST'
                  const isActive = student.status === 'ACTIVE'
                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-muted-foreground text-xs flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {student.email}
                              </span>
                              {student.phone && (
                                <span className="hidden sm:inline-flex items-center gap-1">
                                  • <Phone className="h-3 w-3 text-muted-foreground" />
                                  {student.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-brand-600 font-medium">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground font-medium">
                          {student.programName || (isSchool ? 'General Curriculum' : 'Computer Science')}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {student.departmentName || (isSchool ? 'High School Division' : 'Engineering Dept')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                          {isSchool ? `Term ${student.currentSemester}` : `Sem ${student.currentSemester}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing page {data ? page + 1 : 0} of {data?.totalPages || 1} ({totalStudents} total records)
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

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">
                Add New {isSchool ? 'Pupil' : 'Student'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">First Name *</label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. John"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Last Name *</label>
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Email Address *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@institution.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    {isSchool ? 'Admission Number *' : 'Roll Number *'}
                  </label>
                  <Input
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder={isSchool ? 'SCH-2026-001' : 'CS2026-001'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Gender</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Batch / Year</label>
                  <Input
                    type="number"
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700"
                  disabled={createStudentMutation.isPending}
                >
                  {createStudentMutation.isPending ? 'Saving...' : 'Save Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
