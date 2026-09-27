package com.erp.enrollment.service;

import com.erp.course.entity.Semester;
import com.erp.course.repository.SemesterRepository;
import com.erp.enrollment.dto.CreateEnrollmentRequest;
import com.erp.enrollment.dto.EnrollmentDto;
import com.erp.enrollment.entity.Enrollment;
import com.erp.enrollment.repository.EnrollmentRepository;
import com.erp.student.entity.Student;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;

    @Transactional
    public EnrollmentDto enrollStudent(CreateEnrollmentRequest request) {
        if (enrollmentRepository.existsByStudentIdAndSemesterId(request.getStudentId(), request.getSemesterId())) {
            throw new RuntimeException("Student is already enrolled in this semester");
        }
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .semester(semester)
                .status("ACTIVE")
                .build();

        return mapToDto(enrollmentRepository.save(enrollment));
    }

    @Transactional(readOnly = true)
    public Page<EnrollmentDto> getEnrollmentsBySemester(Long semesterId, Pageable pageable) {
        return enrollmentRepository.findBySemesterId(semesterId, pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public java.util.List<EnrollmentDto> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .toList();
    }

    private EnrollmentDto mapToDto(Enrollment e) {
        return EnrollmentDto.builder()
                .id(e.getId())
                .studentId(e.getStudent().getId())
                .studentName(e.getStudent().getFirstName() + " " + e.getStudent().getLastName())
                .rollNumber(e.getStudent().getRollNumber())
                .semesterId(e.getSemester().getId())
                .semesterName(e.getSemester().getName())
                .academicYear(e.getSemester().getAcademicYear())
                .enrolledAt(e.getEnrolledAt())
                .status(e.getStatus())
                .build();
    }
}
