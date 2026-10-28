import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText, Search, Plus, Calendar, ChevronDown,
  Trophy, AlertCircle, Clock, CheckCircle
} from 'lucide-react'

// Mock hook – replace with real API hook when ExaminationService is fully wired
const useExams = (_status?: string) => ({
  data: [] as any[],
  isLoading: false,
  isError: false,
})

const EXAM_STATUS_OPTIONS = ['ALL', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']
const EXAM_TYPE_OPTIONS = ['ALL', 'MIDTERM', 'FINAL', 'QUIZ', 'ASSIGNMENT', 'PRACTICAL']

export default function ExamsPage() {
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'schedule' | 'results'>('schedule')

  const { data: exams, isLoading, isError } = useExams(status || undefined)

  const filteredExams = exams?.filter((ex: any) =>
    (!search || ex.title?.toLowerCase().includes(search.toLowerCase()) ||
      ex.courseCode?.toLowerCase().includes(search.toLowerCase())) &&
    (!type || type === 'ALL' || ex.type === type)
  )

  const examStats = {
    scheduled: exams?.filter((e: any) => e.status === 'SCHEDULED').length ?? 0,
    ongoing: exams?.filter((e: any) => e.status === 'ONGOING').length ?? 0,
    completed: exams?.filter((e: any) => e.status === 'COMPLETED').length ?? 0,
    avgScore: 74,
  }

  const statusStyle: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-muted text-muted-foreground',
  }

  const StatusIcon = ({ s }: { s: string }) => {
    if (s === 'SCHEDULED') return <Calendar className="h-3.5 w-3.5" />
    if (s === 'ONGOING') return <Clock className="h-3.5 w-3.5" />
    if (s === 'COMPLETED') return <CheckCircle className="h-3.5 w-3.5" />
    return <AlertCircle className="h-3.5 w-3.5" />
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground mt-1">
            Manage {isSchool ? 'school' : 'college'} exam schedules, results, and grading.
          </p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Exam
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: examStats.scheduled, icon: <Calendar className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-500/10' },
          { label: 'Ongoing', value: examStats.ongoing, icon: <Clock className="h-4 w-4 text-yellow-500" />, bg: 'bg-yellow-500/10' },
          { label: 'Completed', value: examStats.completed, icon: <CheckCircle className="h-4 w-4 text-green-500" />, bg: 'bg-green-500/10' },
          { label: 'Avg. Score', value: `${examStats.avgScore}%`, icon: <Trophy className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-500/10' },
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

      {/* Tabs */}
      <div className="flex p-1 bg-muted rounded-lg w-fit">
        {(['schedule', 'results'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'schedule' ? 'Exam Schedule' : 'Results & Grades'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-card p-2 rounded-md border border-border shadow-sm flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder="Search exams..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={status}
            onChange={(e) => setStatus(e.target.value === 'ALL' ? '' : e.target.value)}
          >
            {EXAM_STATUS_OPTIONS.map(s => <option key={s} value={s === 'ALL' ? '' : s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {EXAM_TYPE_OPTIONS.map(t => <option key={t} value={t === 'ALL' ? '' : t}>{t === 'ALL' ? 'All Types' : t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                {activeTab === 'schedule' ? (
                  <>
                    <th className="px-6 py-4 font-medium">Exam Title</th>
                    <th className="px-6 py-4 font-medium">{isSchool ? 'Subject' : 'Course'}</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Venue</th>
                    <th className="px-6 py-4 font-medium">Max Marks</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium">{isSchool ? 'Subject' : 'Course'}</th>
                    <th className="px-6 py-4 font-medium">Exam</th>
                    <th className="px-6 py-4 font-medium">Marks</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                    <th className="px-6 py-4 font-medium">Result</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading exams...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-destructive">Failed to load exams.</td>
                </tr>
              ) : !filteredExams || filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-brand-100/50 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="font-medium">No exams found</p>
                      <p className="text-xs text-muted-foreground">
                        Schedule a new exam to get started.
                      </p>
                      <Button size="sm" className="mt-1 bg-brand-600 hover:bg-brand-700">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Schedule Exam
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : activeTab === 'schedule' ? (
                filteredExams.map((exam: any) => (
                  <tr key={exam.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{exam.title}</td>
                    <td className="px-6 py-4 font-mono text-xs">{exam.courseCode}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">{exam.type}</span>
                    </td>
                    <td className="px-6 py-4">{exam.examDate ? new Date(exam.examDate).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{exam.venue ?? '—'}</td>
                    <td className="px-6 py-4">{exam.maxMarks ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[exam.status] ?? 'bg-muted text-muted-foreground'}`}>
                        <StatusIcon s={exam.status} />
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                filteredExams.map((result: any) => (
                  <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{result.studentName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{result.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{result.courseCode}</td>
                    <td className="px-6 py-4 text-muted-foreground">{result.examTitle}</td>
                    <td className="px-6 py-4">{result.marksObtained} / {result.maxMarks}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 text-xs font-bold">
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.isPassed ? <><CheckCircle className="h-3 w-3" /> Pass</> : <><AlertCircle className="h-3 w-3" /> Fail</>}
                      </span>
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
