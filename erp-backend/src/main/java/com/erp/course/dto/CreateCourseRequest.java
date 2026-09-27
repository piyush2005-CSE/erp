package com.erp.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCourseRequest {
    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course title is required")
    private String title;

    private String description;

    @NotNull(message = "Credits are required")
    private Integer credits;

    private Integer lectureHours;
    private Integer labHours;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String courseType;
}
