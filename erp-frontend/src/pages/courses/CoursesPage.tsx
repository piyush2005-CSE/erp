import { useState } from 'react'
import { useCourses, useSemesters } from '@/api/hooks/useCourses'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, BookOpen, MoreHorizontal, Clock, Users } from 'lucide-react'

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'
  const title = isSchool ? 'Subjects' : 'Courses'
  const subtitle = isSchool
    ? 'Manage academic subjects and class materials.'
    : 'Manage academic courses and credit hours.'

  const { data: courses, isLoading, isError } = useCourses(search || undefined)
  const { data: semesters } = useSemesters()

  const creditOrPeriods = isSchool ? 'Periods/Week' : 'Credits'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="mr-2 h-4 w-4" />
          Add {isSchool ? 'Subject' : 'Course'}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: `Total ${title}`, value: courses?.length ?? 0, icon: <BookOpen className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-500/10' },
          { label: isSchool ? 'Active Terms' : 'Active Semesters', value: semesters?.length ?? 0, icon: <Clock className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-500/10' },
          { label: 'Total Enrollments', value: courses?.reduce((sum: number, c: any) => sum + (c.enrolledCount ?? 0), 0) ?? 0, icon: <Users className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-500/10' },
          { label: `Avg ${creditOrPeriods}`, value: courses?.length ? Math.round(courses.reduce((sum: number, c: any) => sum + (c.credits ?? 0), 0) / courses.length) : 0, icon: <BookOpen className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-500/10' },
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

      {/* Search */}
      <div className="flex items-center space-x-2 bg-card p-2 rounded-md border border-border shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input
          type="text"
          placeholder={`Search by ${isSchool ? 'subject' : 'course'} name or code...`}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">{isSchool ? 'Subject' : 'Course'} Info</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">{creditOrPeriods}</th>
                <th className="px-6 py-4 font-medium">Enrolled</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Loading {title.toLowerCase()}...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-destructive">
                    Failed to load {title.toLowerCase()}.
                  </td>
                </tr>
              ) : !courses || courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-brand-100/50 flex items-center justify-center">
                        <BookOpen className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="font-medium text-foreground">No {title.toLowerCase()} found</p>
                      <p className="text-muted-foreground text-xs max-w-xs">
                        Get started by creating a new {isSchool ? 'subject' : 'course'} in the system.
                      </p>
                      <Button size="sm" className="mt-1 bg-brand-600 hover:bg-brand-700">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add {isSchool ? 'Subject' : 'Course'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{course.title}</div>
                      <div className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{course.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{course.code}</td>
                    <td className="px-6 py-4 text-muted-foreground">{course.departmentName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {course.credits ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.enrolledCount ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
