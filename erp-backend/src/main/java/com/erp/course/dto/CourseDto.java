package com.erp.course.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CourseDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Integer credits;
    private Integer lectureHours;
    private Integer labHours;
    private Long departmentId;
    private String departmentName;
    private String courseType;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
