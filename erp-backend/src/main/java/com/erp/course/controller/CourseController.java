package com.erp.course.controller;

import com.erp.common.response.ApiResponse;
import com.erp.course.dto.*;
import com.erp.course.service.CourseService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // ── Courses ──────────────────────────────────────────────────────────────

    @PostMapping("/courses")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(courseService.createCourse(request), "Course created successfully"));
    }

    @GetMapping("/courses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getAllCourses(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses(search, pageable)));
    }

    @GetMapping("/courses/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CourseDto>> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id)));
    }

    @PatchMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(
            @PathVariable Long id,
            @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success(courseService.updateCourse(id, request), "Course updated"));
    }

    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateCourse(@PathVariable Long id) {
        courseService.deactivateCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Course deactivated"));
    }

    // ── Semesters ─────────────────────────────────────────────────────────────

    @PostMapping("/semesters")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<SemesterDto>> createSemester(@Valid @RequestBody CreateSemesterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(courseService.createSemester(request), "Semester created"));
    }

    @GetMapping("/semesters")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<SemesterDto>>> getAllSemesters() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllSemesters()));
    }

    @GetMapping("/semesters/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SemesterDto>> getCurrentSemester() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCurrentSemester()));
    }

    @GetMapping("/semesters/program/{programId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<SemesterDto>>> getSemestersByProgram(@PathVariable Long programId) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getSemestersByProgram(programId)));
    }
}
