package com.erp.examination.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamResultDto {
    private Long id;
    private Long examId;
    private String examName;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Double marksObtained;
    private String remarks;
    private Boolean hasPassed;
}
