import { FileText } from 'lucide-react'

export default function ExamsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
        <p className="text-muted-foreground">Manage exam schedules and student results.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100/50 mb-4">
          <FileText className="h-10 w-10 text-brand-600" />
        </div>
        <h3 className="text-lg font-medium">No active exams</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Create an examination schedule to get started.
        </p>
      </div>
    </div>
  )
}
