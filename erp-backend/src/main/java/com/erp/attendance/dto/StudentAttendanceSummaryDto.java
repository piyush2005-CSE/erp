package com.erp.attendance.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentAttendanceSummaryDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long courseId;
    private String courseCode;
    private int totalSessions;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private double attendancePercentage;
}
