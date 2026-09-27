package com.erp.examination.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ExamDto {
    private Long id;
    private String name;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Long semesterId;
    private LocalDate examDate;
    private Integer maxMarks;
    private Integer passingMarks;
    private String examType;
    private Boolean isPublished;
}
