package com.erp.fees.controller;

import com.erp.auth.entity.User;
import com.erp.common.response.ApiResponse;
import com.erp.fees.dto.CreateInvoiceRequest;
import com.erp.fees.dto.InvoiceDto;
import com.erp.fees.service.FeesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
public class FeesController {

    private final FeesService feesService;

    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<InvoiceDto>> createInvoice(
            @Valid @RequestBody CreateInvoiceRequest request,
            Authentication auth) {
        Long userId = ((User) auth.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(feesService.createInvoice(request, userId), "Invoice created"));
    }

    @GetMapping("/invoices")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<InvoiceDto>>> getAllInvoices(
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(feesService.getAllInvoices(academicYear, status, pageable)));
    }

    @GetMapping("/invoices/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feesService.getInvoiceById(id)));
    }

    @GetMapping("/invoices/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<InvoiceDto>>> getByStudent(
            @PathVariable Long studentId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(feesService.getInvoicesByStudent(studentId, pageable)));
    }
}
