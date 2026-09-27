package com.erp.course.service;

import com.erp.course.dto.*;
import com.erp.course.entity.Course;
import com.erp.course.entity.Semester;
import com.erp.course.repository.CourseRepository;
import com.erp.course.repository.SemesterRepository;
import com.erp.department.entity.Department;
import com.erp.department.repository.DepartmentRepository;
import com.erp.program.entity.Program;
import com.erp.program.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final DepartmentRepository departmentRepository;
    private final ProgramRepository programRepository;

    // ── Course CRUD ──────────────────────────────────────────────────────────

    @Transactional
    public CourseDto createCourse(CreateCourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course code already exists: " + request.getCode());
        }
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course course = Course.builder()
                .code(request.getCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .credits(request.getCredits() != null ? request.getCredits() : 3)
                .lectureHours(request.getLectureHours() != null ? request.getLectureHours() : 3)
                .labHours(request.getLabHours() != null ? request.getLabHours() : 0)
                .department(dept)
                .courseType(request.getCourseType() != null ? request.getCourseType() : "THEORY")
                .isActive(true)
                .build();

        return mapCourseToDto(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> getAllCourses(String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return courseRepository.search(search, pageable).map(this::mapCourseToDto);
        }
        return courseRepository.findAll(pageable).map(this::mapCourseToDto);
    }

    @Transactional(readOnly = true)
    public CourseDto getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(this::mapCourseToDto)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
    }

    @Transactional
    public CourseDto updateCourse(Long id, CreateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        if (request.getTitle() != null) course.setTitle(request.getTitle());
        if (request.getDescription() != null) course.setDescription(request.getDescription());
        if (request.getCredits() != null) course.setCredits(request.getCredits());
        if (request.getLectureHours() != null) course.setLectureHours(request.getLectureHours());
        if (request.getLabHours() != null) course.setLabHours(request.getLabHours());
        if (request.getCourseType() != null) course.setCourseType(request.getCourseType());
        return mapCourseToDto(courseRepository.save(course));
    }

    @Transactional
    public void deactivateCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsActive(false);
        courseRepository.save(course);
    }

    // ── Semester CRUD ────────────────────────────────────────────────────────

    @Transactional
    public SemesterDto createSemester(CreateSemesterRequest request) {
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        // If marking as current, unmark others
        if (Boolean.TRUE.equals(request.getIsCurrent())) {
            semesterRepository.findByIsCurrent(true)
                    .forEach(s -> { s.setIsCurrent(false); semesterRepository.save(s); });
        }

        Semester semester = Semester.builder()
                .name(request.getName())
                .semesterNumber(request.getSemesterNumber())
                .academicYear(request.getAcademicYear())
                .term(request.getTerm())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isCurrent(Boolean.TRUE.equals(request.getIsCurrent()))
                .program(program)
                .build();

        return mapSemesterToDto(semesterRepository.save(semester));
    }

    @Transactional(readOnly = true)
    public List<SemesterDto> getAllSemesters() {
        return semesterRepository.findAll().stream()
                .map(this::mapSemesterToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SemesterDto getCurrentSemester() {
        return semesterRepository.findFirstByIsCurrentTrue()
                .map(this::mapSemesterToDto)
                .orElseThrow(() -> new RuntimeException("No current semester set"));
    }

    @Transactional(readOnly = true)
    public List<SemesterDto> getSemestersByProgram(Long programId) {
        return semesterRepository.findByProgramId(programId).stream()
                .map(this::mapSemesterToDto)
                .collect(Collectors.toList());
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private CourseDto mapCourseToDto(Course c) {
        return CourseDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .title(c.getTitle())
                .description(c.getDescription())
                .credits(c.getCredits())
                .lectureHours(c.getLectureHours())
                .labHours(c.getLabHours())
                .departmentId(c.getDepartment().getId())
                .departmentName(c.getDepartment().getName())
                .courseType(c.getCourseType())
                .isActive(c.getIsActive())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private SemesterDto mapSemesterToDto(Semester s) {
        return SemesterDto.builder()
                .id(s.getId())
                .name(s.getName())
                .semesterNumber(s.getSemesterNumber())
                .academicYear(s.getAcademicYear())
                .term(s.getTerm())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .isCurrent(s.getIsCurrent())
                .programId(s.getProgram().getId())
                .programName(s.getProgram().getName())
                .build();
    }
}
