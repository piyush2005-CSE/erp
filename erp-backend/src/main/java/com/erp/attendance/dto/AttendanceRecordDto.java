package com.erp.attendance.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceRecordDto {
    private Long id;
    private Long sessionId;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String status;
    private String remarks;
}
