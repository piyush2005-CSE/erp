package com.erp.department.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentDto {
    private Long id;
    private String code;
    private String name;
    private Long hodUserId;
    private String hodName;
    private String phone;
    private String email;
    private boolean isActive;
}
