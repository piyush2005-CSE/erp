package com.erp.faculty.controller;

import com.erp.common.response.ApiResponse;
import com.erp.faculty.dto.CreateFacultyRequest;
import com.erp.faculty.dto.FacultyDto;
import com.erp.faculty.dto.UpdateFacultyRequest;
import com.erp.faculty.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @PostMapping
    @PreAuthorize("hasAuthority('FACULTY_CREATE')")
    public ResponseEntity<ApiResponse<FacultyDto>> createFaculty(@Valid @RequestBody CreateFacultyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.createFaculty(request), "Faculty created"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('FACULTY_READ')")
    public ResponseEntity<ApiResponse<Page<FacultyDto>>> getAllFaculty(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getAllFaculty(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('FACULTY_READ')")
    public ResponseEntity<ApiResponse<FacultyDto>> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getFacultyById(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('FACULTY_UPDATE')")
    public ResponseEntity<ApiResponse<FacultyDto>> updateFaculty(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFacultyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.updateFaculty(id, request), "Faculty updated"));
    }
}
