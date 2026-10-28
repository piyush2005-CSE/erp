import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useLogout } from '@/features/auth/api'
import { Button } from '@/components/ui/button'
import {
  LogOut, User, LayoutDashboard, Settings, Users, BookOpen, CheckSquare,
  FileText, CreditCard, GraduationCap, BarChart3, Bell, Library, Bus,
  Home, School, BookMarked
} from 'lucide-react'

export default function MainLayout() {
  const { user, isAuthenticated, institutionType } = useAuthStore()
  const logoutMutation = useLogout()
  const location = useLocation()
  const isSchool = institutionType === 'SCHOOL'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === path
      : location.pathname.startsWith(path)

  const navItem = (to: string, icon: React.ReactNode, label: string) => (
    <Button
      key={to}
      variant={isActive(to) ? 'secondary' : 'ghost'}
      className={`w-full justify-start transition-all ${
        isActive(to)
          ? 'text-brand-700 bg-brand-100 hover:bg-brand-100 font-semibold'
          : 'text-muted-foreground hover:text-foreground'
      }`}
      asChild
    >
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  )

  const iconClass = 'mr-3 h-4 w-4'

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            {isSchool
              ? <School className="h-6 w-6 text-brand-600" />
              : <GraduationCap className="h-6 w-6 text-brand-600" />
            }
            <h1 className="text-lg font-bold text-foreground">Campus ERP</h1>
          </div>
          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
            isSchool
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-brand-100 text-brand-700'
          }`}>
            {institutionType}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {/* Core */}
          <p className="px-3 pt-2 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Core</p>
          {navItem('/dashboard', <LayoutDashboard className={iconClass} />, 'Dashboard')}
          {navItem('/students', <Users className={iconClass} />, 'Students')}
          {navItem('/faculty', <User className={iconClass} />, isSchool ? 'Teachers' : 'Faculty')}

          {/* Academics */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Academics</p>
          {navItem('/courses', <BookOpen className={iconClass} />, isSchool ? 'Subjects' : 'Courses')}
          {navItem('/enrollments', <BookMarked className={iconClass} />, 'Enrollments')}
          {navItem('/attendance', <CheckSquare className={iconClass} />, 'Attendance')}
          {navItem('/exams', <FileText className={iconClass} />, isSchool ? 'Exams & Tests' : 'Examinations')}

          {/* Finance */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Finance</p>
          {navItem('/fees', <CreditCard className={iconClass} />, 'Fees & Invoicing')}

          {/* Campus */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Campus</p>
          {navItem('/library', <Library className={iconClass} />, 'Library')}
          {!isSchool && navItem('/hostel', <Home className={iconClass} />, 'Hostel')}
          {navItem('/transport', <Bus className={iconClass} />, 'Transport')}

          {/* Admin */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Admin</p>
          {navItem('/reports', <BarChart3 className={iconClass} />, 'Reports')}
          {navItem('/notifications', <Bell className={iconClass} />, 'Notifications')}
          {navItem('/settings', <Settings className={iconClass} />, 'Settings')}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-3 px-1">
            <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.roles?.join(', ')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="text-base font-semibold capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
