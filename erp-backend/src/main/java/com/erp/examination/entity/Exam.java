package com.erp.examination.entity;

import com.erp.course.entity.Course;
import com.erp.course.entity.Semester;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Semester semester;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "max_marks", nullable = false)
    @Builder.Default
    private Integer maxMarks = 100;

    @Column(name = "passing_marks", nullable = false)
    @Builder.Default
    private Integer passingMarks = 40;

    @Column(name = "exam_type", length = 20)
    @Builder.Default
    private String examType = "FINAL"; // e.g. MIDTERM, FINAL

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
