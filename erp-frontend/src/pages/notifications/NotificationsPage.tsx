import { useState } from 'react'
import {
  Bell,
  CheckCheck,
  Info,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AppNotification {
  id: number
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  category: 'SYSTEM' | 'FEES' | 'EXAMS' | 'ACADEMIC' | 'GENERAL'
  title: string
  message: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    type: 'INFO',
    category: 'SYSTEM',
    title: 'Scheduled Cloud Maintenance',
    message: 'The Campus ERP database will undergo regular security patches on Saturday 11:00 PM – 01:00 AM.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'SUCCESS',
    category: 'FEES',
    title: 'Monthly Tuition Invoices Reconciled',
    message: '94% of fall semester installment invoices have been collected and verified by the treasury.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'WARNING',
    category: 'ACADEMIC',
    title: 'Low Attendance Warning Generated',
    message: '14 enrolled students have fallen below the mandatory 75% attendance threshold this month.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 4,
    type: 'INFO',
    category: 'EXAMS',
    title: 'Mid-Term Examination Seating Plan Released',
    message: 'Hall tickets and room allocations for Hall A and Hall B are now available for student download.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 5,
    type: 'INFO',
    category: 'GENERAL',
    title: 'Annual Sports & Cultural Festival Announced',
    message: 'Nominations for inter-departmental athletic and coding tournaments are open until next Friday.',
    time: '3 days ago',
    read: true,
  },
]

const TYPE_CONFIG = {
  INFO: {
    icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-100 dark:border-blue-900/50',
  },
  SUCCESS: {
    icon: <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-100 dark:border-emerald-900/50',
  },
  WARNING: {
    icon: <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-100 dark:border-amber-900/50',
  },
  ERROR: {
    icon: <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-100 dark:border-rose-900/50',
  },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New Notice Form
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState<'SYSTEM' | 'FEES' | 'EXAMS' | 'ACADEMIC' | 'GENERAL'>('GENERAL')
  const [type, setType] = useState<'INFO' | 'SUCCESS' | 'WARNING'>('INFO')

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleToggleRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return

    const newNotif: AppNotification = {
      id: Date.now(),
      type,
      category,
      title,
      message,
      time: 'Just now',
      read: false,
    }
    setNotifications([newNotif, ...notifications])
    setIsModalOpen(false)
    setTitle('')
    setMessage('')
  }

  const filteredNotifs = notifications.filter(
    (n) => filterCategory === 'ALL' || n.category === filterCategory
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''} requiring attention.`
              : 'You are completely caught up on all campus alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="shadow-sm"
          >
            <CheckCheck className="mr-1.5 h-4 w-4" />
            Mark all read
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Broadcast Notice
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        {['ALL', 'ACADEMIC', 'FEES', 'EXAMS', 'SYSTEM', 'GENERAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100/50 mb-3">
              <Bell className="h-7 w-7 text-brand-600" />
            </div>
            <h3 className="font-semibold text-foreground">No notifications in this category</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select another category or broadcast a new notice.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const style = TYPE_CONFIG[notif.type] || TYPE_CONFIG.INFO
            return (
              <div
                key={notif.id}
                className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-4 transition-all hover:shadow-sm ${
                  notif.read ? 'bg-card border-border' : `${style.bg} ${style.border}`
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    notif.read ? 'bg-muted' : 'bg-white/80 dark:bg-black/30 shadow-sm'
                  }`}
                >
                  {style.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold ${
                          notif.read ? 'text-foreground/80' : 'text-foreground'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse shrink-0" />
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">
                        {notif.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/40">
                    <button
                      onClick={() => handleToggleRead(notif.id)}
                      className="text-xs text-brand-600 hover:underline font-medium"
                    >
                      {notif.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                    <span className="text-muted-foreground text-xs">•</span>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold">Broadcast Campus Announcement</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Notice Title *</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Campus Holiday on November 15"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Category</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMS">Examinations</option>
                    <option value="FEES">Fees & Finance</option>
                    <option value="SYSTEM">System & IT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Priority / Tone</label>
                  <select
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="INFO">Informational (Blue)</option>
                    <option value="SUCCESS">Success / Achievement (Green)</option>
                    <option value="WARNING">Important Alert (Yellow)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Message Body *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write announcement details..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Publish to Everyone
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
