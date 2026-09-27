package com.erp.attendance.entity;

import com.erp.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private AttendanceSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String status = "PRESENT";

    @Column(length = 255)
    private String remarks;

    @Column(name = "marked_at", nullable = false)
    @Builder.Default
    private LocalDateTime markedAt = LocalDateTime.now();

    @Column(name = "marked_by", nullable = false)
    private Long markedBy;
}
