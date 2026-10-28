package com.erp.student.service;

import com.erp.auth.entity.Role;
import com.erp.auth.entity.User;
import com.erp.auth.repository.RoleRepository;
import com.erp.auth.repository.UserRepository;
import com.erp.department.entity.Department;
import com.erp.department.repository.DepartmentRepository;
import com.erp.program.entity.Program;
import com.erp.program.repository.ProgramRepository;
import com.erp.student.dto.CreateStudentRequest;
import com.erp.student.dto.StudentDto;
import com.erp.student.dto.UpdateStudentRequest;
import com.erp.student.entity.Student;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final ProgramRepository programRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public StudentDto createStudent(CreateStudentRequest request) {
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("STUDENT role not found"));

        String instType = request.getInstitutionType() != null && !request.getInstitutionType().isBlank()
                ? request.getInstitutionType()
                : (department.getInstitutionType() != null ? department.getInstitutionType() : "COLLEGE");

        // Create base user
        User user = User.builder()
                .username(request.getRollNumber()) // typically roll number is username for students
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .institutionType(instType)
                .roles(Collections.singleton(studentRole))
                .build();
        
        user = userRepository.save(user);

        // Create student profile
        Student student = Student.builder()
                .user(user)
                .rollNumber(request.getRollNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .department(department)
                .program(program)
                .batchYear(request.getBatchYear())
                .admissionDate(request.getAdmissionDate())
                .institutionType(instType)
                .build();

        student = studentRepository.save(student);
        return mapToDto(student);
    }

    @Transactional(readOnly = true)
    public Page<StudentDto> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<StudentDto> getAllStudents(String institutionType, String search, Pageable pageable) {
        if (institutionType != null || search != null) {
            return studentRepository.searchStudents(institutionType, search, pageable).map(this::mapToDto);
        }
        return studentRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Transactional
    public StudentDto updateStudent(Long id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Update basic info
        if (request.getFirstName() != null) student.setFirstName(request.getFirstName());
        if (request.getLastName() != null) student.setLastName(request.getLastName());
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getPersonalEmail() != null) student.setPersonalEmail(request.getPersonalEmail());
        if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) student.setGender(request.getGender());
        if (request.getBloodGroup() != null) student.setBloodGroup(request.getBloodGroup());
        if (request.getAddressLine1() != null) student.setAddressLine1(request.getAddressLine1());
        if (request.getCity() != null) student.setCity(request.getCity());
        if (request.getState() != null) student.setState(request.getState());
        if (request.getPincode() != null) student.setPincode(request.getPincode());

        // Guardian info
        if (request.getGuardianName() != null) student.setGuardianName(request.getGuardianName());
        if (request.getGuardianPhone() != null) student.setGuardianPhone(request.getGuardianPhone());
        if (request.getGuardianRelation() != null) student.setGuardianRelation(request.getGuardianRelation());

        // Sync user table basic details
        User user = student.getUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        return mapToDto(studentRepository.save(student));
    }

    private StudentDto mapToDto(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .rollNumber(student.getRollNumber())
                .enrollmentNumber(student.getEnrollmentNumber())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .bloodGroup(student.getBloodGroup())
                .category(student.getCategory())
                .departmentId(student.getDepartment().getId())
                .departmentName(student.getDepartment().getName())
                .programId(student.getProgram().getId())
                .programName(student.getProgram().getName())
                .currentSemester(student.getCurrentSemester())
                .batchYear(student.getBatchYear())
                .admissionDate(student.getAdmissionDate())
                .status(student.getStatus())
                .institutionType(student.getInstitutionType() != null ? student.getInstitutionType() : "COLLEGE")
                .build();
    }
}
