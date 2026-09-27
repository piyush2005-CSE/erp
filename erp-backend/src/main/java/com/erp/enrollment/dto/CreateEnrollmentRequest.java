package com.erp.enrollment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateEnrollmentRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Semester ID is required")
    private Long semesterId;

    private Long sectionId;
}
