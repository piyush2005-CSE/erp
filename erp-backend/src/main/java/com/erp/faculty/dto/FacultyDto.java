package com.erp.faculty.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class FacultyDto {
    private Long id;
    private Long userId;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private LocalDate joiningDate;
    private String employmentType;
    private BigDecimal salary;
    private String status;
}
