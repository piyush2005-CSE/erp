package com.erp.enrollment.repository;

import com.erp.enrollment.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentIdAndSemesterId(Long studentId, Long semesterId);
    Optional<Enrollment> findByStudentIdAndSemesterId(Long studentId, Long semesterId);
    Page<Enrollment> findBySemesterId(Long semesterId, Pageable pageable);
    List<Enrollment> findByStudentId(Long studentId);
    long countBySemesterIdAndStatus(Long semesterId, String status);
}
