package com.erp.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class CreateAttendanceSessionRequest {
    @NotNull private Long courseId;
    @NotNull private Long facultyId;
    @NotNull private Long semesterId;
    @NotNull private LocalDate sessionDate;
    @NotNull private LocalTime startTime;
    @NotNull private LocalTime endTime;
    private String topicCovered;
    private String sessionType = "LECTURE";
    private List<StudentAttendanceEntry> attendanceEntries;

    @Data
    public static class StudentAttendanceEntry {
        private Long studentId;
        private String status; // PRESENT, ABSENT, LATE, EXCUSED
        private String remarks;
    }
}
