package com.erp.attendance.repository;

import com.erp.attendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findBySessionId(Long sessionId);
    boolean existsBySessionIdAndStudentId(Long sessionId, Long studentId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.session.course.id = :courseId")
    List<AttendanceRecord> findByStudentAndCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.session.course.id = :courseId AND ar.status = :status")
    long countByStudentCourseStatus(@Param("studentId") Long studentId, @Param("courseId") Long courseId, @Param("status") String status);
}
