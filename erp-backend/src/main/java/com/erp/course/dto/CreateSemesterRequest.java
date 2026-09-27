package com.erp.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateSemesterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Semester number is required")
    private Integer semesterNumber;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotBlank(message = "Term is required (ODD/EVEN)")
    private String term;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Program ID is required")
    private Long programId;

    private Boolean isCurrent = false;
}
