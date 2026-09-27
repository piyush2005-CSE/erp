package com.erp.attendance.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AttendanceSessionDto {
    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Long facultyId;
    private String facultyName;
    private Long semesterId;
    private String semesterName;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String topicCovered;
    private String sessionType;
    private Boolean isFinalized;
    private int totalStudents;
    private int presentCount;
}
