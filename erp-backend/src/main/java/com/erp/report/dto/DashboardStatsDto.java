package com.erp.report.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long activeStudents;
    private long totalFaculty;
    private long activeFaculty;
    private long totalCourses;
    private long activeCourses;
    private long totalDepartments;
    private long pendingInvoices;
    private long paidInvoices;
    private BigDecimal totalFeesCollected;
    private long totalEnrollments;
}
