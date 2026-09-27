package com.erp.fees.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateInvoiceRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Base amount is required")
    private BigDecimal baseAmount;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private LocalDate dueDate;
    private String notes;
    private Long feeStructureId;
}
