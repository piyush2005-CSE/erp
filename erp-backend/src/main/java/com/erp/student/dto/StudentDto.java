package com.erp.student.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StudentDto {
    private Long id;
    private Long userId;
    private String rollNumber;
    private String enrollmentNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String category;
    
    // Academic Info
    private Long departmentId;
    private String departmentName;
    private Long programId;
    private String programName;
    private Integer currentSemester;
    private Integer batchYear;
    private LocalDate admissionDate;
    private String status;
}
