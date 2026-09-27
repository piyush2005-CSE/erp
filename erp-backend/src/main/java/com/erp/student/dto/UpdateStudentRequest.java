package com.erp.student.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateStudentRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String personalEmail;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String addressLine1;
    private String city;
    private String state;
    private String pincode;
    
    // Guardian Info
    private String guardianName;
    private String guardianPhone;
    private String guardianRelation;
}
