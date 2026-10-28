import { useState } from 'react'
import { useInvoices } from '@/api/hooks/useFees'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CreditCard, Search, Plus, CheckCircle, Clock, XCircle,
  TrendingUp, DollarSign, AlertTriangle, ChevronDown
} from 'lucide-react'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED']
const YEAR_OPTIONS = ['2026-2027', '2025-2026', '2024-2025']

export default function FeesPage() {
  const { institutionType } = useAuthStore()
  const isSchool = institutionType === 'SCHOOL'

  const [status, setStatus] = useState('')
  const [academicYear, setAcademicYear] = useState(YEAR_OPTIONS[0])
  const [search, setSearch] = useState('')

  const { data: invoices, isLoading, isError } = useInvoices(academicYear, status || undefined)

  const filteredInvoices = invoices?.filter((inv: any) =>
    !search || inv.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const totalCollected = invoices?.filter((i: any) => i.status === 'PAID')
    .reduce((sum: number, i: any) => sum + (i.amount ?? 0), 0) ?? 0
  const totalPending = invoices?.filter((i: any) => i.status === 'PENDING')
    .reduce((sum: number, i: any) => sum + (i.amount ?? 0), 0) ?? 0
  const totalOverdue = invoices?.filter((i: any) => i.status === 'OVERDUE').length ?? 0
  const totalInvoices = invoices?.length ?? 0

  const statusStyle: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-muted text-muted-foreground',
  }

  const StatusIcon = ({ s }: { s: string }) => {
    if (s === 'PAID') return <CheckCircle className="h-3.5 w-3.5" />
    if (s === 'PENDING') return <Clock className="h-3.5 w-3.5" />
    if (s === 'OVERDUE') return <AlertTriangle className="h-3.5 w-3.5" />
    return <XCircle className="h-3.5 w-3.5" />
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fees &amp; Invoicing</h1>
          <p className="text-muted-foreground mt-1">
            Manage {isSchool ? 'school' : 'college'} fees, generate invoices, and track payments.
          </p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-500/10' },
          { label: 'Pending Amount', value: `$${totalPending.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-yellow-500" />, bg: 'bg-yellow-500/10' },
          { label: 'Overdue Invoices', value: totalOverdue, icon: <AlertTriangle className="h-4 w-4 text-red-500" />, bg: 'bg-red-500/10' },
          { label: 'Total Invoices', value: totalInvoices, icon: <CreditCard className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-500/10' },
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-card p-2 rounded-md border border-border shadow-sm flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder="Search by student or invoice #..."
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
            {STATUS_OPTIONS.map(s => <option key={s} value={s === 'ALL' ? '' : s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>AY {y}</option>)}
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
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading invoices...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-destructive">Failed to load invoices.</td>
                </tr>
              ) : !filteredInvoices || filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-brand-100/50 flex items-center justify-center">
                        <CreditCard className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="font-medium">No invoices found</p>
                      <p className="text-xs text-muted-foreground">Generate new invoices or adjust your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-600">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{invoice.studentName}</div>
                      <div className="text-xs text-muted-foreground">{invoice.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{invoice.description}</td>
                    <td className="px-6 py-4 font-semibold">${(invoice.amount ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[invoice.status] ?? 'bg-muted text-muted-foreground'}`}>
                        <StatusIcon s={invoice.status} />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invoice.status === 'PENDING' || invoice.status === 'OVERDUE' ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs border-brand-600 text-brand-600 hover:bg-brand-50">
                          Record Payment
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                          View
                        </Button>
                      )}
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
