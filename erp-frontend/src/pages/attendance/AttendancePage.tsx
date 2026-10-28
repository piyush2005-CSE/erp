import { useState } from 'react'
import { useCourses, useSemesters } from '@/api/hooks/useCourses'
import { useAttendanceSessions } from '@/api/hooks/useAttendance'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { CheckSquare, XSquare, Clock, AlertCircle, Users, TrendingUp, ChevronDown } from 'lucide-react'

export default function AttendancePage() {
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>()
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>()

  const { data: courses } = useCourses()
  const { data: semesters } = useSemesters()
  const { data: sessions, isLoading: sessionsLoading } = useAttendanceSessions(selectedCourseId, selectedSemesterId)

  const courseLabel = isSchool ? 'Subject' : 'Course'
  const semesterLabel = isSchool ? 'Term' : 'Semester'

  const selectedCourse = courses?.find((c: any) => c.id === selectedCourseId)

  // Stats from sessions (mocked until real data)
  const totalSessions = sessions?.length ?? 0
  const avgAttendance = 78 // Will be computed from real API data

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Track and monitor student attendance across {isSchool ? 'subjects' : 'courses'}.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[200px]"
            value={selectedCourseId ?? ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Select {courseLabel}</option>
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.code} – {c.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[180px]"
            value={selectedSemesterId ?? ''}
            onChange={(e) => setSelectedSemesterId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Select {semesterLabel}</option>
            {semesters?.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Not selected state */}
      {!selectedCourseId || !selectedSemesterId ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100/50 mb-4">
            <CheckSquare className="h-10 w-10 text-brand-600" />
          </div>
          <h3 className="text-lg font-medium">Select a {courseLabel} & {semesterLabel}</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Choose a {courseLabel.toLowerCase()} and {semesterLabel.toLowerCase()} from the filters above to view attendance records.
          </p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Sessions', value: totalSessions, icon: <Clock className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-500/10' },
              { label: 'Avg. Attendance', value: `${avgAttendance}%`, icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-500/10' },
              { label: 'Students Enrolled', value: selectedCourse?.enrolledCount ?? 0, icon: <Users className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-500/10' },
              { label: 'Below 75%', value: sessions?.filter((s: any) => s.attendanceRate < 75).length ?? 0, icon: <AlertCircle className="h-4 w-4 text-red-500" />, bg: 'bg-red-500/10' },
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

          {/* Sessions table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Attendance Sessions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedCourse?.code} – {selectedCourse?.title}
                </p>
              </div>
              <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
                Mark Attendance
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Topic</th>
                    <th className="px-6 py-3 font-medium">Present</th>
                    <th className="px-6 py-3 font-medium">Absent</th>
                    <th className="px-6 py-3 font-medium">Rate</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sessionsLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Loading sessions...
                      </td>
                    </tr>
                  ) : !sessions || sessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No attendance sessions found for this selection.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session: any) => {
                      const rate = session.attendanceRate ?? 0
                      return (
                        <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">{new Date(session.sessionDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-foreground">{session.topic ?? 'Class Session'}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-green-700">
                              <CheckSquare className="h-3.5 w-3.5" />
                              {session.presentCount ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <XSquare className="h-3.5 w-3.5" />
                              {session.absentCount ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rate >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${rate >= 75 ? 'text-green-700' : 'text-red-600'}`}>
                                {rate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              session.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status ?? 'DRAFT'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
