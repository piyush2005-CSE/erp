package com.erp.faculty.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateFacultyRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    
    private String designation;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private String employmentType;
    private BigDecimal salary;
    private String status;
    
    private String addressLine1;
    private String city;
    private String state;
    private String pincode;
}
