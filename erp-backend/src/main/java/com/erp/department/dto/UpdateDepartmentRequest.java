package com.erp.department.dto;

import lombok.Data;

@Data
public class UpdateDepartmentRequest {
    private String name;
    private Long hodUserId;
    private String phone;
    private String email;
    private Boolean isActive;
}
