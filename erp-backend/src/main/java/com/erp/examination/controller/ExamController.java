package com.erp.examination.controller;

import com.erp.common.response.ApiResponse;
import com.erp.examination.dto.ExamDto;
import com.erp.examination.dto.ExamResultDto;
import com.erp.examination.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExaminationService examinationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<ExamDto>>> getExams(
            @RequestParam Long semesterId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(examinationService.getExams(semesterId, pageable)));
    }

    @GetMapping("/results/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ExamResultDto>>> getResults(
            @PathVariable Long studentId, @RequestParam Long semesterId) {
        return ResponseEntity.ok(ApiResponse.success(
                examinationService.getResultsByStudentAndSemester(studentId, semesterId)));
    }
}
