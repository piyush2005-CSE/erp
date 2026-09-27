-- ============================================================
-- V3 – Students & Faculty/Staff
-- ============================================================

CREATE TABLE students (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    user_id             BIGINT          NOT NULL UNIQUE,
    roll_number         VARCHAR(30)     NOT NULL UNIQUE,
    enrollment_number   VARCHAR(30)     UNIQUE,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    email               VARCHAR(150)    NOT NULL UNIQUE,
    personal_email      VARCHAR(150),
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              VARCHAR(10)     COMMENT 'MALE, FEMALE, OTHER',
    blood_group         VARCHAR(5),
    nationality         VARCHAR(50)     DEFAULT 'Indian',
    religion            VARCHAR(50),
    category            VARCHAR(30)     COMMENT 'GENERAL, OBC, SC, ST, EWS',
    aadhar_number       VARCHAR(20),
    address_line1       VARCHAR(255),
    address_line2       VARCHAR(255),
    city                VARCHAR(100),
    state               VARCHAR(100),
    pincode             VARCHAR(10),
    country             VARCHAR(100)    DEFAULT 'India',
    -- Academic
    department_id       BIGINT          NOT NULL,
    program_id          BIGINT          NOT NULL,
    current_semester    TINYINT         NOT NULL DEFAULT 1,
    batch_year          YEAR            NOT NULL,
    admission_date      DATE            NOT NULL,
    expected_graduation DATE,
    status              VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE'
                        COMMENT 'ACTIVE, INACTIVE, GRADUATED, DROPPED, SUSPENDED',
    -- Guardian
    guardian_name       VARCHAR(150),
    guardian_phone      VARCHAR(20),
    guardian_relation   VARCHAR(50),
    guardian_email      VARCHAR(150),
    -- Metadata
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_stu_user  FOREIGN KEY (user_id)       REFERENCES users(id),
    CONSTRAINT fk_stu_dept  FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_stu_prog  FOREIGN KEY (program_id)    REFERENCES programs(id),
    INDEX idx_stu_roll  (roll_number),
    INDEX idx_stu_email (email),
    INDEX idx_stu_dept  (department_id),
    INDEX idx_stu_prog  (program_id),
    INDEX idx_stu_batch (batch_year),
    INDEX idx_stu_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faculty (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    user_id             BIGINT          NOT NULL UNIQUE,
    employee_id         VARCHAR(30)     NOT NULL UNIQUE,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    email               VARCHAR(150)    NOT NULL UNIQUE,
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              VARCHAR(10),
    blood_group         VARCHAR(5),
    aadhar_number       VARCHAR(20),
    pan_number          VARCHAR(20),
    department_id       BIGINT          NOT NULL,
    designation         VARCHAR(100)    COMMENT 'Professor, Assoc. Professor, etc.',
    qualification       VARCHAR(200),
    specialization      VARCHAR(200),
    experience_years    TINYINT         DEFAULT 0,
    joining_date        DATE            NOT NULL,
    employment_type     VARCHAR(20)     DEFAULT 'FULL_TIME' COMMENT 'FULL_TIME, PART_TIME, GUEST',
    salary              DECIMAL(12,2),
    status              VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, ON_LEAVE',
    address_line1       VARCHAR(255),
    city                VARCHAR(100),
    state               VARCHAR(100),
    pincode             VARCHAR(10),
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_fac_user FOREIGN KEY (user_id)       REFERENCES users(id),
    CONSTRAINT fk_fac_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_fac_emp_id (employee_id),
    INDEX idx_fac_dept   (department_id),
    INDEX idx_fac_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add HOD FK now that faculty table exists (deferred FK)
ALTER TABLE departments
    ADD CONSTRAINT fk_dept_hod FOREIGN KEY (hod_user_id) REFERENCES users(id) ON DELETE SET NULL;
