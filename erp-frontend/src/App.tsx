import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import StudentListPage from '@/pages/students/StudentListPage'
import FacultyListPage from '@/pages/faculty/FacultyListPage'
import CoursesPage from '@/pages/courses/CoursesPage'
import EnrollmentsPage from '@/pages/enrollments/EnrollmentsPage'
import AttendancePage from '@/pages/attendance/AttendancePage'
import ExamsPage from '@/pages/exams/ExamsPage'
import FeesPage from '@/pages/fees/FeesPage'
import LibraryPage from '@/pages/library/LibraryPage'
import HostelPage from '@/pages/hostel/HostelPage'
import TransportPage from '@/pages/transport/TransportPage'
import ReportsPage from '@/pages/reports/ReportsPage'
import NotificationsPage from '@/pages/notifications/NotificationsPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import MainLayout from '@/layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/faculty" element={<FacultyListPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
