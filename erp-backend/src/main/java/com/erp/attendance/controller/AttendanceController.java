package com.erp.attendance.controller;

import com.erp.attendance.dto.*;
import com.erp.attendance.service.AttendanceService;
import com.erp.auth.service.UserDetailsServiceImpl;
import com.erp.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/sessions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY')")
    public ResponseEntity<ApiResponse<AttendanceSessionDto>> createSession(
            @Valid @RequestBody CreateAttendanceSessionRequest request,
            Authentication auth) {
        // Extract user ID from principal
        Long userId = ((com.erp.auth.entity.User) auth.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(attendanceService.createSession(request, userId), "Session created"));
    }

    @GetMapping("/sessions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<AttendanceSessionDto>>> getSessions(
            @RequestParam Long courseId,
            @RequestParam Long semesterId,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getSessionsByCourseAndSemester(courseId, semesterId, pageable)));
    }

    @GetMapping("/sessions/{sessionId}/records")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AttendanceRecordDto>>> getRecords(@PathVariable Long sessionId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getRecordsBySession(sessionId)));
    }

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StudentAttendanceSummaryDto>> getSummary(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceSummary(studentId, courseId)));
    }
}
