export interface Student {
  id: number
  userId: number
  rollNumber: string
  enrollmentNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  category: string
  departmentId: number
  departmentName: string
  programId: number
  programName: string
  currentSemester: number
  batchYear: number
  admissionDate: string
  status: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
}

export interface CreateStudentFormData {
  firstName: string
  lastName: string
  email: string
  rollNumber: string
  departmentId: number
  programId: number
  batchYear: number
  admissionDate: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  password?: string
}
