-- ============================================================
-- V7 – Attendance
-- ============================================================

-- Attendance session: one class period / lab session
CREATE TABLE attendance_sessions (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    course_id       BIGINT      NOT NULL,
    section_id      BIGINT      NOT NULL,
    faculty_id      BIGINT      NOT NULL,
    semester_id     BIGINT      NOT NULL,
    session_date    DATE        NOT NULL,
    start_time      TIME        NOT NULL,
    end_time        TIME        NOT NULL,
    topic_covered   VARCHAR(300),
    session_type    VARCHAR(20) DEFAULT 'LECTURE' COMMENT 'LECTURE, LAB, TUTORIAL',
    is_finalized    BOOLEAN     NOT NULL DEFAULT FALSE,
    finalized_at    DATETIME,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_as_crs  FOREIGN KEY (course_id)  REFERENCES courses(id),
    CONSTRAINT fk_as_sec  FOREIGN KEY (section_id) REFERENCES sections(id),
    CONSTRAINT fk_as_fac  FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    CONSTRAINT fk_as_sem  FOREIGN KEY (semester_id) REFERENCES semesters(id),
    INDEX idx_as_date    (session_date),
    INDEX idx_as_course  (course_id),
    INDEX idx_as_section (section_id),
    INDEX idx_as_faculty (faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-student attendance record for each session
CREATE TABLE attendance_records (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    session_id      BIGINT      NOT NULL,
    student_id      BIGINT      NOT NULL,
    status          VARCHAR(10) NOT NULL COMMENT 'PRESENT, ABSENT, LATE, EXCUSED',
    remarks         VARCHAR(255),
    marked_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    marked_by       BIGINT      NOT NULL COMMENT 'Faculty user ID',
    PRIMARY KEY (id),
    UNIQUE KEY uq_ar (session_id, student_id),
    CONSTRAINT fk_ar_session FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_student FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_ar_student (student_id),
    INDEX idx_ar_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leave applications
CREATE TABLE leave_applications (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    student_id      BIGINT      NOT NULL,
    from_date       DATE        NOT NULL,
    to_date         DATE        NOT NULL,
    reason          TEXT        NOT NULL,
    leave_type      VARCHAR(30) DEFAULT 'MEDICAL' COMMENT 'MEDICAL, PERSONAL, EVENT, OTHER',
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
    reviewed_by     BIGINT,
    reviewed_at     DATETIME,
    reviewer_remark VARCHAR(500),
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_la_student FOREIGN KEY (student_id)  REFERENCES students(id),
    CONSTRAINT fk_la_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_la_student (student_id),
    INDEX idx_la_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
