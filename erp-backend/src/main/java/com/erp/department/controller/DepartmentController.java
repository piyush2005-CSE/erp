package com.erp.department.controller;

import com.erp.common.response.ApiResponse;
import com.erp.department.dto.CreateDepartmentRequest;
import com.erp.department.dto.DepartmentDto;
import com.erp.department.dto.UpdateDepartmentRequest;
import com.erp.department.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_CREATE')")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.createDepartment(request), "Department created"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllDepartments()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getDepartmentById(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_UPDATE')")
    public ResponseEntity<ApiResponse<DepartmentDto>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.updateDepartment(id, request), "Department updated"));
    }
}
