package com.erp.attendance.repository;

import com.erp.attendance.entity.AttendanceSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    Page<AttendanceSession> findByCourseIdAndSemesterId(Long courseId, Long semesterId, Pageable pageable);

    @Query("SELECT s FROM AttendanceSession s WHERE s.sessionDate = :date AND s.semester.id = :semId")
    List<AttendanceSession> findByDateAndSemester(@Param("date") LocalDate date, @Param("semId") Long semesterId);

    long countByCourseIdAndSemesterId(Long courseId, Long semesterId);
}
