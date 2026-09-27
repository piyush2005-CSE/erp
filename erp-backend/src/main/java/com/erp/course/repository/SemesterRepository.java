package com.erp.course.repository;

import com.erp.course.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findByIsCurrent(boolean isCurrent);
    Optional<Semester> findFirstByIsCurrentTrue();
    List<Semester> findByProgramId(Long programId);
    List<Semester> findByAcademicYear(String academicYear);
}
