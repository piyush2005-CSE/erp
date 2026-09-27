-- ============================================================
-- V8 – Examinations, Marks & Results
-- ============================================================

CREATE TABLE examinations (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(200)    NOT NULL COMMENT 'e.g. Mid-Term I, End-Term, Internal Assessment',
    exam_type       VARCHAR(30)     NOT NULL COMMENT 'MID_TERM, END_TERM, INTERNAL, PRACTICAL, VIVA',
    semester_id     BIGINT          NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    is_published    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_by      BIGINT          NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_exam_sem  FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT fk_exam_user FOREIGN KEY (created_by)  REFERENCES users(id),
    INDEX idx_exam_sem (semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-course schedule within an exam
CREATE TABLE exam_schedules (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    examination_id  BIGINT      NOT NULL,
    course_id       BIGINT      NOT NULL,
    exam_date       DATE        NOT NULL,
    start_time      TIME        NOT NULL,
    end_time        TIME        NOT NULL,
    classroom_id    BIGINT,
    max_marks       DECIMAL(6,2) NOT NULL DEFAULT 100,
    pass_marks      DECIMAL(6,2) NOT NULL DEFAULT 40,
    PRIMARY KEY (id),
    UNIQUE KEY uq_es (examination_id, course_id),
    CONSTRAINT fk_es_exam FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    CONSTRAINT fk_es_crs  FOREIGN KEY (course_id)      REFERENCES courses(id),
    CONSTRAINT fk_es_room FOREIGN KEY (classroom_id)   REFERENCES classrooms(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student marks per exam-course
CREATE TABLE marks (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    student_id      BIGINT          NOT NULL,
    exam_schedule_id BIGINT         NOT NULL,
    marks_obtained  DECIMAL(6,2),
    is_absent       BOOLEAN         NOT NULL DEFAULT FALSE,
    is_malpractice  BOOLEAN         NOT NULL DEFAULT FALSE,
    remarks         VARCHAR(255),
    entered_by      BIGINT          NOT NULL,
    entered_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by     BIGINT,
    approved_at     DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uq_marks (student_id, exam_schedule_id),
    CONSTRAINT fk_mk_student FOREIGN KEY (student_id)       REFERENCES students(id),
    CONSTRAINT fk_mk_sched   FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules(id),
    CONSTRAINT fk_mk_entered FOREIGN KEY (entered_by)       REFERENCES users(id),
    CONSTRAINT fk_mk_approved FOREIGN KEY (approved_by)     REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_mk_student (student_id),
    INDEX idx_mk_sched   (exam_schedule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Consolidated semester result per student per course
CREATE TABLE results (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    student_id          BIGINT          NOT NULL,
    course_id           BIGINT          NOT NULL,
    semester_id         BIGINT          NOT NULL,
    internal_marks      DECIMAL(6,2),
    external_marks      DECIMAL(6,2),
    practical_marks     DECIMAL(6,2),
    total_marks         DECIMAL(6,2),
    grade               VARCHAR(5)      COMMENT 'A+, A, B+, B, C, D, F',
    grade_points        DECIMAL(4,2)    COMMENT 'GPA points e.g. 10, 9, 8...',
    credits_earned      TINYINT,
    is_pass             BOOLEAN,
    result_status       VARCHAR(20)     DEFAULT 'PENDING' COMMENT 'PENDING, DECLARED, WITHHELD',
    remarks             VARCHAR(255),
    declared_at         DATETIME,
    declared_by         BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY uq_result (student_id, course_id, semester_id),
    CONSTRAINT fk_res_stu  FOREIGN KEY (student_id)  REFERENCES students(id),
    CONSTRAINT fk_res_crs  FOREIGN KEY (course_id)   REFERENCES courses(id),
    CONSTRAINT fk_res_sem  FOREIGN KEY (semester_id) REFERENCES semesters(id),
    INDEX idx_res_student (student_id),
    INDEX idx_res_sem     (semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Semester CGPA/SGPA summary
CREATE TABLE semester_results (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    student_id      BIGINT          NOT NULL,
    semester_id     BIGINT          NOT NULL,
    sgpa            DECIMAL(4,2),
    cgpa            DECIMAL(4,2),
    total_credits   INT,
    credits_earned  INT,
    result          VARCHAR(20)     COMMENT 'PASS, FAIL, WITHHELD, ABSENT',
    rank_in_class   INT,
    published       BOOLEAN         NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sr (student_id, semester_id),
    CONSTRAINT fk_sr_stu FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_sr_sem FOREIGN KEY (semester_id) REFERENCES semesters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
