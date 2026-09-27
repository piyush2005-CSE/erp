import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import StudentListPage from '@/pages/students/StudentListPage'
import FacultyListPage from '@/pages/faculty/FacultyListPage'
import CoursesPage from '@/pages/courses/CoursesPage'
import AttendancePage from '@/pages/attendance/AttendancePage'
import ExamsPage from '@/pages/exams/ExamsPage'
import FeesPage from '@/pages/fees/FeesPage'
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
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
