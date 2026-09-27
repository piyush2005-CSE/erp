package com.erp.fees.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceDto {
    private Long id;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private BigDecimal baseAmount;
    private BigDecimal discountAmount;
    private BigDecimal lateFeeAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private String status;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private String academicYear;
    private String notes;
    private LocalDateTime createdAt;
}
