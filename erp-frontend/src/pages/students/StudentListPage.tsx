import { useState } from 'react'
import { useStudents } from '@/features/students/api'
import { Button } from '@/components/ui/button'
import { Plus, Search, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function StudentListPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useStudents(page, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records, enrollments, and profiles.
          </p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-md border border-border shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          type="text" 
          placeholder="Search by name, roll number..." 
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium">Roll Number</th>
                <th className="px-6 py-4 font-medium">Program</th>
                <th className="px-6 py-4 font-medium">Semester</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading students...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-destructive">
                    Failed to load students.
                  </td>
                </tr>
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              ) : (
                data?.content.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-muted-foreground text-xs">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{student.rollNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{student.programName}</div>
                      <div className="text-muted-foreground text-xs">{student.departmentName}</div>
                    </td>
                    <td className="px-6 py-4">Sem {student.currentSemester}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">
                        {student.status}
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
        {/* Simple Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing page {data ? page + 1 : 0} of {data?.totalPages || 0}
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={data ? page >= data.totalPages - 1 : true}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
