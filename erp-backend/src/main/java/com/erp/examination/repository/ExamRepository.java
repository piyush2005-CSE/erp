package com.erp.examination.repository;

import com.erp.examination.entity.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    Page<Exam> findByCourseIdAndSemesterId(Long courseId, Long semesterId, Pageable pageable);
    Page<Exam> findBySemesterId(Long semesterId, Pageable pageable);
}
