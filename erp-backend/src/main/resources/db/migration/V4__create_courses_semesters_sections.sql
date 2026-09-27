-- ============================================================
-- V4 – Courses, Semesters, Sections, Timetable
-- ============================================================

CREATE TABLE semesters (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL COMMENT 'e.g. Semester 1 – 2024-25 (Even)',
    semester_number TINYINT         NOT NULL COMMENT '1-8',
    academic_year   VARCHAR(20)     NOT NULL COMMENT 'e.g. 2024-25',
    term            VARCHAR(10)     NOT NULL COMMENT 'ODD, EVEN',
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    is_current      BOOLEAN         NOT NULL DEFAULT FALSE,
    program_id      BIGINT          NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_sem_prog FOREIGN KEY (program_id) REFERENCES programs(id),
    INDEX idx_sem_current (is_current),
    INDEX idx_sem_prog (program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE courses (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    code            VARCHAR(20)     NOT NULL UNIQUE COMMENT 'e.g. CS301',
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    credits         TINYINT         NOT NULL DEFAULT 3,
    lecture_hours   TINYINT         DEFAULT 3,
    lab_hours       TINYINT         DEFAULT 0,
    department_id   BIGINT          NOT NULL,
    course_type     VARCHAR(20)     DEFAULT 'THEORY' COMMENT 'THEORY, LAB, PROJECT, ELECTIVE',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_crs_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_crs_code (code),
    INDEX idx_crs_dept (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses offered per semester (which courses appear in which semester of a program)
CREATE TABLE semester_courses (
    id              BIGINT  NOT NULL AUTO_INCREMENT,
    semester_id     BIGINT  NOT NULL,
    course_id       BIGINT  NOT NULL,
    faculty_id      BIGINT  COMMENT 'Assigned faculty for this course this semester',
    max_students    INT     DEFAULT 60,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sc (semester_id, course_id),
    CONSTRAINT fk_sc_sem     FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT fk_sc_crs     FOREIGN KEY (course_id)   REFERENCES courses(id),
    CONSTRAINT fk_sc_faculty FOREIGN KEY (faculty_id)  REFERENCES faculty(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sections (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(10)     NOT NULL COMMENT 'e.g. A, B, C',
    semester_id     BIGINT          NOT NULL,
    program_id      BIGINT          NOT NULL,
    class_teacher_id BIGINT,
    room_number     VARCHAR(20),
    max_strength    INT             DEFAULT 60,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sec (semester_id, program_id, name),
    CONSTRAINT fk_sec_sem FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT fk_sec_prog FOREIGN KEY (program_id) REFERENCES programs(id),
    CONSTRAINT fk_sec_teacher FOREIGN KEY (class_teacher_id) REFERENCES faculty(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE classrooms (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    room_number     VARCHAR(20) NOT NULL UNIQUE,
    building        VARCHAR(100),
    floor           TINYINT     DEFAULT 0,
    capacity        INT         DEFAULT 60,
    room_type       VARCHAR(30) DEFAULT 'CLASSROOM' COMMENT 'CLASSROOM, LAB, SEMINAR, AUDITORIUM',
    has_projector   BOOLEAN     DEFAULT FALSE,
    is_active       BOOLEAN     DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
