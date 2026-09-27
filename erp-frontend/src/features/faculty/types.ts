export interface Faculty {
  id: number
  userId: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  departmentId: number
  departmentName: string
  designation: string
  qualification: string
  specialization: string
  experienceYears: number
  joiningDate: string
  employmentType: string
  salary: number
  status: string
}

export interface CreateFacultyFormData {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  departmentId: number
  designation: string
  joiningDate: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  password?: string
  qualification?: string
  specialization?: string
  experienceYears?: number
  employmentType?: string
  salary?: number
}
