package com.erp.report.service;

import com.erp.course.repository.CourseRepository;
import com.erp.department.repository.DepartmentRepository;
import com.erp.enrollment.repository.EnrollmentRepository;
import com.erp.faculty.repository.FacultyRepository;
import com.erp.fees.repository.InvoiceRepository;
import com.erp.report.dto.DashboardStatsDto;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.countByStatus("ACTIVE");
        long totalFaculty = facultyRepository.count();
        long activeFaculty = facultyRepository.countByStatus("ACTIVE");
        long totalCourses = courseRepository.count();
        long activeCourses = courseRepository.countByIsActive(true);
        long totalDepts = departmentRepository.count();
        long pendingInvoices = invoiceRepository.countByStatus("UNPAID");
        long paidInvoices = invoiceRepository.countByStatus("PAID");
        BigDecimal totalFees = invoiceRepository.totalCollectedByYear(getCurrentAcademicYear());
        long enrollments = enrollmentRepository.count();

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .totalFaculty(totalFaculty)
                .activeFaculty(activeFaculty)
                .totalCourses(totalCourses)
                .activeCourses(activeCourses)
                .totalDepartments(totalDepts)
                .pendingInvoices(pendingInvoices)
                .paidInvoices(paidInvoices)
                .totalFeesCollected(totalFees != null ? totalFees : BigDecimal.ZERO)
                .totalEnrollments(enrollments)
                .build();
    }

    private String getCurrentAcademicYear() {
        int year = java.time.LocalDate.now().getYear();
        return year + "-" + (year + 1);
    }
}
