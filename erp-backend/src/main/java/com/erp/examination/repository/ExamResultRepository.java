package com.erp.examination.repository;

import com.erp.examination.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByExamId(Long examId);
    List<ExamResult> findByStudentIdAndExamSemesterId(Long studentId, Long semesterId);
    boolean existsByExamIdAndStudentId(Long examId, Long studentId);
}
