import { useState } from 'react'
import {
  User,
  Shield,
  Bell,
  Palette,
  School,
  GraduationCap,
  CheckCircle,
  KeyRound,
  Save,
  Moon,
  Sun,
  Laptop
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'

const TABS = ['Profile', 'Institution Mode', 'Appearance', 'Security', 'Notifications'] as const
type Tab = (typeof TABS)[number]

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Profile: <User className="h-4 w-4" />,
  'Institution Mode': <School className="h-4 w-4" />,
  Appearance: <Palette className="h-4 w-4" />,
  Security: <Shield className="h-4 w-4" />,
  Notifications: <Bell className="h-4 w-4" />,
}

export default function SettingsPage() {
  const { user, institutionType, setInstitutionType } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  // Profile Form
  const [firstName, setFirstName] = useState(user?.firstName || 'Admin')
  const [lastName, setLastName] = useState(user?.lastName || 'User')
  const [email, setEmail] = useState(user?.email || 'admin@erp.edu')
  const [profileSaved, setProfileSaved] = useState(false)

  // Appearance
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system')

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')

  // Notifications Toggles
  const [notifPreferences, setNotifPreferences] = useState({
    feeAlerts: true,
    attendanceAlerts: true,
    examSchedules: true,
    systemUpdates: false,
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setSecurityMessage('Passwords do not match.')
      return
    }
    setSecurityMessage('Password changed successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSecurityMessage(''), 3000)
  }

  const isSchool = institutionType === 'SCHOOL'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account credentials, institutional mode, and workspace preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="md:w-60 shrink-0">
          <nav className="space-y-1 bg-card p-2 rounded-2xl border border-border shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {TAB_ICONS[tab]}
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Panel */}
        <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold">Profile Details</h2>
                  <p className="text-xs text-muted-foreground">
                    Update your public administrator details.
                  </p>
                </div>
                {profileSaved && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle className="h-4 w-4" /> Profile Updated!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold text-2xl flex items-center justify-center border-2 border-brand-200">
                  {firstName[0] || 'A'}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted font-medium"
                      >
                        {role}
                      </span>
                    )) || (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                        SUPER_ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Work Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                    <Save className="mr-1.5 h-4 w-4" /> Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* INSTITUTION MODE TAB */}
          {activeTab === 'Institution Mode' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h2 className="text-lg font-bold">Institution Mode & Terminology</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure whether this ERP deployment functions as a K-12 School or a Higher Education College / University.
                </p>
              </div>

              {/* Mode Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setInstitutionType('COLLEGE')}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                    !isSchool
                      ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-950/20 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      {!isSchool && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                          Active Mode
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-foreground">College & University</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tailored for colleges, polytechnics, and higher education universities with semesters, faculty designations, and credit courses.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 text-xs space-y-1 text-muted-foreground font-mono">
                    <p>• Faculty & Professors</p>
                    <p>• Degree Programs & Semesters</p>
                    <p>• Credit Hours & Courses</p>
                  </div>
                </div>

                <div
                  onClick={() => setInstitutionType('SCHOOL')}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                    isSchool
                      ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-950/20 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                        <School className="h-5 w-5" />
                      </div>
                      {isSchool && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                          Active Mode
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-foreground">K-12 School Edition</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Optimized for primary, middle, and high schools with terms, subject teachers, class standards, and grade cards.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 text-xs space-y-1 text-muted-foreground font-mono">
                    <p>• Teachers & Educators</p>
                    <p>• Standards, Classes & Terms</p>
                    <p>• School Subjects & Periods</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Active Configuration:</span> Switching
                modes updates the navigation bar, student tables, course labels, and fee structures
                instantly across all tabs without requiring a server reboot.
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'Appearance' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h2 className="text-lg font-bold">Theme & Display</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize the look and feel of your Campus ERP interface.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { mode: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
                    { mode: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
                    { mode: 'system', label: 'System', icon: <Laptop className="h-4 w-4" /> },
                  ].map((t) => (
                    <button
                      key={t.mode}
                      onClick={() => setThemeMode(t.mode as any)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        themeMode === t.mode
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                          : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-foreground">Interface Accent</label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                  Brand palette applied to buttons, badges, and progress indicators.
                </p>
                <div className="flex items-center gap-3">
                  {['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899'].map((c) => (
                    <div
                      key={c}
                      style={{ backgroundColor: c }}
                      className="h-8 w-8 rounded-full border-2 border-white dark:border-black cursor-pointer shadow-sm hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h2 className="text-lg font-bold">Account Security & Credentials</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your master administrator password and review active login sessions.
                </p>
              </div>

              {securityMessage && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    securityMessage.includes('successfully')
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                  }`}
                >
                  {securityMessage}
                </div>
              )}

              <form onSubmit={handleSecurityUpdate} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Current Password</label>
                  <Input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">New Password</label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Confirm New Password</label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>

                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  <KeyRound className="mr-1.5 h-4 w-4" /> Update Credentials
                </Button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h2 className="text-lg font-bold">Email & Push Notifications</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure real-time automated dispatch rules for administrative alerts.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'feeAlerts',
                    title: 'Tuition Fee Receivables Alerts',
                    desc: 'Notify when student invoices become overdue or installment payments are verified.',
                  },
                  {
                    key: 'attendanceAlerts',
                    title: 'Attendance Shortfall Notifications',
                    desc: 'Automated warnings when a student falls below 75% class attendance.',
                  },
                  {
                    key: 'examSchedules',
                    title: 'Examination & Grade Publishing',
                    desc: 'Immediate dispatch when hall tickets or semester results are finalized.',
                  },
                  {
                    key: 'systemUpdates',
                    title: 'System Security & Backup Logs',
                    desc: 'Daily digest of database backups, audit events, and user logins.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={(notifPreferences as any)[item.key]}
                      onChange={(e) =>
                        setNotifPreferences({
                          ...notifPreferences,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-brand-600 rounded border-border focus:ring-brand-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
