package com.erp.department.service;

import com.erp.auth.entity.User;
import com.erp.auth.repository.UserRepository;
import com.erp.department.dto.CreateDepartmentRequest;
import com.erp.department.dto.DepartmentDto;
import com.erp.department.dto.UpdateDepartmentRequest;
import com.erp.department.entity.Department;
import com.erp.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public DepartmentDto createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Department code already exists");
        }

        User hod = null;
        if (request.getHodUserId() != null) {
            hod = userRepository.findById(request.getHodUserId())
                    .orElseThrow(() -> new RuntimeException("HOD User not found"));
        }

        Department department = Department.builder()
                .code(request.getCode())
                .name(request.getName())
                .hod(hod)
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();

        return mapToDto(departmentRepository.save(department));
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, UpdateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        if (request.getName() != null) department.setName(request.getName());
        if (request.getPhone() != null) department.setPhone(request.getPhone());
        if (request.getEmail() != null) department.setEmail(request.getEmail());
        if (request.getIsActive() != null) department.setActive(request.getIsActive());

        if (request.getHodUserId() != null) {
            User hod = userRepository.findById(request.getHodUserId())
                    .orElseThrow(() -> new RuntimeException("HOD User not found"));
            department.setHod(hod);
        }

        return mapToDto(departmentRepository.save(department));
    }

    private DepartmentDto mapToDto(Department department) {
        return DepartmentDto.builder()
                .id(department.getId())
                .code(department.getCode())
                .name(department.getName())
                .hodUserId(department.getHod() != null ? department.getHod().getId() : null)
                .hodName(department.getHod() != null ? department.getHod().getFirstName() + " " + department.getHod().getLastName() : null)
                .phone(department.getPhone())
                .email(department.getEmail())
                .isActive(department.isActive())
                .build();
    }
}
