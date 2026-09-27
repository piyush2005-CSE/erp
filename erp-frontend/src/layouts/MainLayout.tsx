import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useLogout } from '@/features/auth/api'
import { Button } from '@/components/ui/button'
import { LogOut, User, LayoutDashboard, Settings, Users, BookOpen, CheckSquare, FileText, CreditCard } from 'lucide-react'

export default function MainLayout() {
  const { user, isAuthenticated } = useAuthStore()
  const logoutMutation = useLogout()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold text-brand-600">Campus ERP</h1>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Button 
            variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/dashboard">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/students') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/students">
              <Users className="mr-3 h-5 w-5" />
              Students
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/faculty') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/faculty">
              <User className="mr-3 h-5 w-5" />
              Faculty
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/courses') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/courses">
              <BookOpen className="mr-3 h-5 w-5" />
              Courses
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/attendance') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/attendance">
              <CheckSquare className="mr-3 h-5 w-5" />
              Attendance
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/exams') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/exams">
              <FileText className="mr-3 h-5 w-5" />
              Exams
            </Link>
          </Button>
          <Button 
            variant={location.pathname.startsWith('/fees') ? 'secondary' : 'ghost'} 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/fees">
              <CreditCard className="mr-3 h-5 w-5" />
              Fees
            </Link>
          </Button>
          {/* Add more nav items here based on roles */}
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold shrink-0">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.roles.join(', ')}</p>
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
          <h2 className="text-lg font-medium">Overview</h2>
          <div className="flex items-center space-x-4">
             <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
               <Settings className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
               <User className="h-5 w-5" />
             </Button>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
