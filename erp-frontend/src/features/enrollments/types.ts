export interface Enrollment {
  id: number
  studentId: number
  studentName: string
  rollNumber: string
  semesterId: number
  semesterName: string
  courseId: number
  courseCode: string
  courseTitle: string
  enrollmentDate: string
  status: string
}

export interface CreateEnrollmentFormData {
  studentId: number
  semesterId: number
  courseId: number
}
