package com.erp.faculty.service;

import com.erp.auth.entity.Role;
import com.erp.auth.entity.User;
import com.erp.auth.repository.RoleRepository;
import com.erp.auth.repository.UserRepository;
import com.erp.department.entity.Department;
import com.erp.department.repository.DepartmentRepository;
import com.erp.faculty.dto.CreateFacultyRequest;
import com.erp.faculty.dto.FacultyDto;
import com.erp.faculty.dto.UpdateFacultyRequest;
import com.erp.faculty.entity.Faculty;
import com.erp.faculty.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public FacultyDto createFaculty(CreateFacultyRequest request) {
        if (facultyRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Role facultyRole = roleRepository.findByName("FACULTY")
                .orElseThrow(() -> new RuntimeException("FACULTY role not found"));

        // Create base user
        User user = User.builder()
                .username(request.getEmployeeId()) // employee ID as username
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .roles(Collections.singleton(facultyRole))
                .build();
        
        user = userRepository.save(user);

        // Create faculty profile
        Faculty faculty = Faculty.builder()
                .user(user)
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .department(department)
                .designation(request.getDesignation())
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0)
                .joiningDate(request.getJoiningDate())
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : "FULL_TIME")
                .salary(request.getSalary())
                .build();

        return mapToDto(facultyRepository.save(faculty));
    }

    @Transactional(readOnly = true)
    public Page<FacultyDto> getAllFaculty(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public FacultyDto getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    @Transactional
    public FacultyDto updateFaculty(Long id, UpdateFacultyRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        if (request.getFirstName() != null) faculty.setFirstName(request.getFirstName());
        if (request.getLastName() != null) faculty.setLastName(request.getLastName());
        if (request.getPhone() != null) faculty.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) faculty.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) faculty.setGender(request.getGender());
        
        if (request.getDesignation() != null) faculty.setDesignation(request.getDesignation());
        if (request.getQualification() != null) faculty.setQualification(request.getQualification());
        if (request.getSpecialization() != null) faculty.setSpecialization(request.getSpecialization());
        if (request.getExperienceYears() != null) faculty.setExperienceYears(request.getExperienceYears());
        if (request.getEmploymentType() != null) faculty.setEmploymentType(request.getEmploymentType());
        if (request.getSalary() != null) faculty.setSalary(request.getSalary());
        if (request.getStatus() != null) faculty.setStatus(request.getStatus());

        if (request.getAddressLine1() != null) faculty.setAddressLine1(request.getAddressLine1());
        if (request.getCity() != null) faculty.setCity(request.getCity());
        if (request.getState() != null) faculty.setState(request.getState());
        if (request.getPincode() != null) faculty.setPincode(request.getPincode());

        // Sync user table
        User user = faculty.getUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        return mapToDto(facultyRepository.save(faculty));
    }

    private FacultyDto mapToDto(Faculty faculty) {
        return FacultyDto.builder()
                .id(faculty.getId())
                .userId(faculty.getUser().getId())
                .employeeId(faculty.getEmployeeId())
                .firstName(faculty.getFirstName())
                .lastName(faculty.getLastName())
                .email(faculty.getEmail())
                .phone(faculty.getPhone())
                .dateOfBirth(faculty.getDateOfBirth())
                .gender(faculty.getGender())
                .departmentId(faculty.getDepartment().getId())
                .departmentName(faculty.getDepartment().getName())
                .designation(faculty.getDesignation())
                .qualification(faculty.getQualification())
                .specialization(faculty.getSpecialization())
                .experienceYears(faculty.getExperienceYears())
                .joiningDate(faculty.getJoiningDate())
                .employmentType(faculty.getEmploymentType())
                .salary(faculty.getSalary())
                .status(faculty.getStatus())
                .build();
    }
}
