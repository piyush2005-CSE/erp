package com.erp.enrollment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EnrollmentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long semesterId;
    private String semesterName;
    private String academicYear;
    private LocalDateTime enrolledAt;
    private String status;
}
