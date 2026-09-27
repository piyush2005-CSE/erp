package com.erp.course.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SemesterDto {
    private Long id;
    private String name;
    private Integer semesterNumber;
    private String academicYear;
    private String term;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private Long programId;
    private String programName;
}
