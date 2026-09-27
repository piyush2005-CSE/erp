import { CreditCard } from 'lucide-react'

export default function FeesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Fees & Invoicing</h1>
        <p className="text-muted-foreground">Manage student fees and track payments.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100/50 mb-4">
          <CreditCard className="h-10 w-10 text-brand-600" />
        </div>
        <h3 className="text-lg font-medium">Fee Dashboard</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Generate new invoices or process payments here.
        </p>
      </div>
    </div>
  )
}
