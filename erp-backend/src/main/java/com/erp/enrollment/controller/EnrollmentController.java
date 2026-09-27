package com.erp.enrollment.controller;

import com.erp.common.response.ApiResponse;
import com.erp.enrollment.dto.CreateEnrollmentRequest;
import com.erp.enrollment.dto.EnrollmentDto;
import com.erp.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<EnrollmentDto>> enroll(@Valid @RequestBody CreateEnrollmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(enrollmentService.enrollStudent(request), "Student enrolled successfully"));
    }

    @GetMapping("/semester/{semesterId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<EnrollmentDto>>> getBySemester(
            @PathVariable Long semesterId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsBySemester(semesterId, pageable)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsByStudent(studentId)));
    }
}
