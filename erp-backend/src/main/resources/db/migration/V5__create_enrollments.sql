-- ============================================================
-- V5 – Student Enrollments
-- ============================================================

CREATE TABLE enrollments (
    id                  BIGINT      NOT NULL AUTO_INCREMENT,
    student_id          BIGINT      NOT NULL,
    semester_id         BIGINT      NOT NULL,
    section_id          BIGINT,
    enrolled_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                        COMMENT 'ACTIVE, DROPPED, COMPLETED, REPEAT',
    dropped_at          DATETIME,
    drop_reason         VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uq_enr (student_id, semester_id),
    CONSTRAINT fk_enr_stu  FOREIGN KEY (student_id)  REFERENCES students(id),
    CONSTRAINT fk_enr_sem  FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT fk_enr_sec  FOREIGN KEY (section_id)  REFERENCES sections(id) ON DELETE SET NULL,
    INDEX idx_enr_stu    (student_id),
    INDEX idx_enr_sem    (semester_id),
    INDEX idx_enr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Which specific courses a student is taking (sub-enrollment per course)
CREATE TABLE student_courses (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    enrollment_id   BIGINT      NOT NULL,
    course_id       BIGINT      NOT NULL,
    semester_id     BIGINT      NOT NULL,
    is_elective     BOOLEAN     NOT NULL DEFAULT FALSE,
    status          VARCHAR(20) NOT NULL DEFAULT 'ENROLLED' COMMENT 'ENROLLED, DROPPED, COMPLETED',
    enrolled_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sc_enr (enrollment_id, course_id),
    CONSTRAINT fk_sc_enr FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    CONSTRAINT fk_sc_crs2 FOREIGN KEY (course_id)    REFERENCES courses(id),
    CONSTRAINT fk_sc_sem2 FOREIGN KEY (semester_id)  REFERENCES semesters(id),
    INDEX idx_sc_enr (enrollment_id),
    INDEX idx_sc_crs (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
