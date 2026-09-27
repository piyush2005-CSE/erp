package com.erp.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateStudentRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Program ID is required")
    private Long programId;

    @NotNull(message = "Batch year is required")
    private Integer batchYear;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;

    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String password; // Raw password to be hashed
}
