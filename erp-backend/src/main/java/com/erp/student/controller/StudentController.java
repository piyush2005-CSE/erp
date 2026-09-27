package com.erp.student.controller;

import com.erp.common.response.ApiResponse;
import com.erp.student.dto.CreateStudentRequest;
import com.erp.student.dto.StudentDto;
import com.erp.student.dto.UpdateStudentRequest;
import com.erp.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT_CREATE')")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        StudentDto student = studentService.createStudent(request);
        return ResponseEntity.ok(ApiResponse.success(student, "Student created successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT_READ')")
    public ResponseEntity<ApiResponse<Page<StudentDto>>> getAllStudents(Pageable pageable) {
        Page<StudentDto> students = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_READ')")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_UPDATE')")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStudentRequest request) {
        StudentDto student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success(student, "Student updated successfully"));
    }
}
