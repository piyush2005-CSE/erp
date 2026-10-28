package com.erp.attendance.service;

import com.erp.attendance.dto.*;
import com.erp.attendance.entity.AttendanceRecord;
import com.erp.attendance.entity.AttendanceSession;
import com.erp.attendance.repository.AttendanceRecordRepository;
import com.erp.attendance.repository.AttendanceSessionRepository;
import com.erp.course.entity.Course;
import com.erp.course.entity.Semester;
import com.erp.course.repository.CourseRepository;
import com.erp.course.repository.SemesterRepository;
import com.erp.faculty.entity.Faculty;
import com.erp.faculty.repository.FacultyRepository;
import com.erp.student.entity.Student;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final SemesterRepository semesterRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public AttendanceSessionDto createSession(CreateAttendanceSessionRequest request, Long markedByUserId) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        AttendanceSession session = AttendanceSession.builder()
                .course(course)
                .faculty(faculty)
                .semester(semester)
                .sessionDate(request.getSessionDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .topicCovered(request.getTopicCovered())
                .sessionType(request.getSessionType() != null ? request.getSessionType() : "LECTURE")
                .build();

        session = sessionRepository.save(session);

        // Save individual records if provided
        if (request.getAttendanceEntries() != null) {
            final AttendanceSession savedSession = session;
            for (CreateAttendanceSessionRequest.StudentAttendanceEntry entry : request.getAttendanceEntries()) {
                Student student = studentRepository.findById(entry.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found: " + entry.getStudentId()));
                AttendanceRecord record = AttendanceRecord.builder()
                        .session(savedSession)
                        .student(student)
                        .status(entry.getStatus() != null ? entry.getStatus() : "PRESENT")
                        .remarks(entry.getRemarks())
                        .markedBy(markedByUserId)
                        .build();
                recordRepository.save(record);
            }
        }

        return mapSessionToDto(session);
    }

    @Transactional(readOnly = true)
    public Page<AttendanceSessionDto> getSessionsByCourseAndSemester(Long courseId, Long semesterId, Pageable pageable) {
        return sessionRepository.findByCourseIdAndSemesterId(courseId, semesterId, pageable)
                .map(this::mapSessionToDto);
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordDto> getRecordsBySession(Long sessionId) {
        return recordRepository.findBySessionId(sessionId).stream()
                .map(this::mapRecordToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentAttendanceSummaryDto getStudentAttendanceSummary(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<AttendanceRecord> records = recordRepository.findByStudentAndCourse(studentId, courseId);
        long present = records.stream().filter(r -> "PRESENT".equals(r.getStatus())).count();
        long absent = records.stream().filter(r -> "ABSENT".equals(r.getStatus())).count();
        long late = records.stream().filter(r -> "LATE".equals(r.getStatus())).count();
        int totalRecords = records.size();
        double pct = totalRecords > 0 ? (present * 100.0 / totalRecords) : 0;

        return StudentAttendanceSummaryDto.builder()
                .studentId(studentId)
                .studentName(student.getFirstName() + " " + student.getLastName())
                .rollNumber(student.getRollNumber())
                .courseId(courseId)
                .courseCode(course.getCode())
                .totalSessions(totalRecords)
                .presentCount((int) present)
                .absentCount((int) absent)
                .lateCount((int) late)
                .attendancePercentage(Math.round(pct * 10.0) / 10.0)
                .build();
    }

    private AttendanceSessionDto mapSessionToDto(AttendanceSession s) {
        List<AttendanceRecord> records = recordRepository.findBySessionId(s.getId());
        long present = records.stream().filter(r -> "PRESENT".equals(r.getStatus())).count();
        return AttendanceSessionDto.builder()
                .id(s.getId())
                .courseId(s.getCourse().getId())
                .courseCode(s.getCourse().getCode())
                .courseTitle(s.getCourse().getTitle())
                .facultyId(s.getFaculty().getId())
                .facultyName(s.getFaculty().getFirstName() + " " + s.getFaculty().getLastName())
                .semesterId(s.getSemester().getId())
                .semesterName(s.getSemester().getName())
                .sessionDate(s.getSessionDate())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .topicCovered(s.getTopicCovered())
                .sessionType(s.getSessionType())
                .isFinalized(s.getIsFinalized())
                .totalStudents(records.size())
                .presentCount((int) present)
                .build();
    }

    private AttendanceRecordDto mapRecordToDto(AttendanceRecord r) {
        return AttendanceRecordDto.builder()
                .id(r.getId())
                .sessionId(r.getSession().getId())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getFirstName() + " " + r.getStudent().getLastName())
                .rollNumber(r.getStudent().getRollNumber())
                .status(r.getStatus())
                .remarks(r.getRemarks())
                .build();
    }
}
