-- ============================================================
-- V2 – Departments & Academic Programs
-- ============================================================

CREATE TABLE departments (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    code            VARCHAR(20)     NOT NULL UNIQUE COMMENT 'e.g. CS, ECE, MBA',
    name            VARCHAR(150)    NOT NULL,
    hod_user_id     BIGINT          COMMENT 'FK to users (set after faculty is created)',
    phone           VARCHAR(20),
    email           VARCHAR(150),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_dept_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE programs (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    code            VARCHAR(20)     NOT NULL UNIQUE COMMENT 'e.g. BTECH-CS, MBA',
    name            VARCHAR(200)    NOT NULL COMMENT 'e.g. B.Tech Computer Science',
    degree_type     VARCHAR(50)     NOT NULL COMMENT 'UNDERGRADUATE, POSTGRADUATE, DIPLOMA, PHD',
    department_id   BIGINT          NOT NULL,
    duration_years  TINYINT         NOT NULL DEFAULT 4,
    total_semesters TINYINT         NOT NULL DEFAULT 8,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_prog_dept FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample departments
INSERT INTO departments (code, name) VALUES
    ('ADMIN', 'Administration'),
    ('CS',    'Computer Science & Engineering'),
    ('ECE',   'Electronics & Communication'),
    ('MECH',  'Mechanical Engineering'),
    ('CIVIL', 'Civil Engineering'),
    ('MBA',   'Master of Business Administration'),
    ('LIB',   'Library'),
    ('FIN',   'Finance');
