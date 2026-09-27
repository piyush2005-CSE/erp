-- ============================================================
-- V6 – Timetable
-- ============================================================

CREATE TABLE timetable_slots (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    section_id      BIGINT          NOT NULL,
    course_id       BIGINT          NOT NULL,
    faculty_id      BIGINT,
    classroom_id    BIGINT,
    semester_id     BIGINT          NOT NULL,
    day_of_week     TINYINT         NOT NULL COMMENT '1=Monday … 7=Sunday',
    start_time      TIME            NOT NULL,
    end_time        TIME            NOT NULL,
    slot_type       VARCHAR(20)     DEFAULT 'LECTURE' COMMENT 'LECTURE, LAB, TUTORIAL, BREAK',
    effective_from  DATE            NOT NULL,
    effective_to    DATE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_tt_sec   FOREIGN KEY (section_id)   REFERENCES sections(id),
    CONSTRAINT fk_tt_crs   FOREIGN KEY (course_id)    REFERENCES courses(id),
    CONSTRAINT fk_tt_fac   FOREIGN KEY (faculty_id)   REFERENCES faculty(id) ON DELETE SET NULL,
    CONSTRAINT fk_tt_room  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE SET NULL,
    CONSTRAINT fk_tt_sem   FOREIGN KEY (semester_id)  REFERENCES semesters(id),
    INDEX idx_tt_section (section_id),
    INDEX idx_tt_faculty (faculty_id),
    INDEX idx_tt_day     (day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
