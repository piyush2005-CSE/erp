-- ============================================================
-- V9 – Fee Structures, Invoices & Payments
-- ============================================================

CREATE TABLE fee_categories (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL UNIQUE COMMENT 'Tuition, Hostel, Library, Transport, Exam',
    description VARCHAR(255),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fee_structures (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(200)    NOT NULL,
    category_id     BIGINT          NOT NULL,
    program_id      BIGINT,             -- NULL = applicable to all programs
    semester_id     BIGINT,            -- NULL = one-time or annual fee
    academic_year   VARCHAR(20)     NOT NULL COMMENT 'e.g. 2024-25',
    amount          DECIMAL(12,2)   NOT NULL,
    due_date        DATE,
    late_fee_per_day DECIMAL(8,2)   DEFAULT 0,
    is_mandatory    BOOLEAN         NOT NULL DEFAULT TRUE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_fs_cat  FOREIGN KEY (category_id) REFERENCES fee_categories(id),
    CONSTRAINT fk_fs_prog FOREIGN KEY (program_id)  REFERENCES programs(id)   ON DELETE SET NULL,
    CONSTRAINT fk_fs_sem  FOREIGN KEY (semester_id) REFERENCES semesters(id)  ON DELETE SET NULL,
    INDEX idx_fs_program (program_id),
    INDEX idx_fs_year    (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoices (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    invoice_number  VARCHAR(30)     NOT NULL UNIQUE,
    student_id      BIGINT          NOT NULL,
    fee_structure_id BIGINT         NOT NULL,
    base_amount     DECIMAL(12,2)   NOT NULL,
    discount_amount DECIMAL(12,2)   NOT NULL DEFAULT 0,
    late_fee_amount DECIMAL(12,2)   NOT NULL DEFAULT 0,
    net_amount      DECIMAL(12,2)   NOT NULL,
    paid_amount     DECIMAL(12,2)   NOT NULL DEFAULT 0,
    balance_amount  DECIMAL(12,2)   GENERATED ALWAYS AS (net_amount - paid_amount) STORED,
    status          VARCHAR(20)     NOT NULL DEFAULT 'UNPAID' COMMENT 'UNPAID, PARTIAL, PAID, OVERDUE, WAIVED',
    issue_date      DATE            NOT NULL,
    due_date        DATE,
    academic_year   VARCHAR(20)     NOT NULL,
    notes           VARCHAR(500),
    created_by      BIGINT          NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_inv_stu FOREIGN KEY (student_id)      REFERENCES students(id),
    CONSTRAINT fk_inv_fs  FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id),
    CONSTRAINT fk_inv_usr FOREIGN KEY (created_by)      REFERENCES users(id),
    INDEX idx_inv_student (student_id),
    INDEX idx_inv_status  (status),
    INDEX idx_inv_year    (academic_year),
    INDEX idx_inv_number  (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    invoice_id          BIGINT          NOT NULL,
    student_id          BIGINT          NOT NULL,
    payment_reference   VARCHAR(100)    NOT NULL UNIQUE COMMENT 'Transaction/receipt number',
    amount              DECIMAL(12,2)   NOT NULL,
    payment_mode        VARCHAR(30)     NOT NULL COMMENT 'CASH, ONLINE, CHEQUE, DD, NEFT, UPI',
    payment_date        DATE            NOT NULL,
    bank_name           VARCHAR(100),
    cheque_number       VARCHAR(50),
    transaction_id      VARCHAR(200)    COMMENT 'Gateway transaction ID',
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, VERIFIED, FAILED, REFUNDED',
    verified_by         BIGINT,
    verified_at         DATETIME,
    remarks             VARCHAR(500),
    receipt_url         VARCHAR(500),
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_pay_inv FOREIGN KEY (invoice_id)  REFERENCES invoices(id),
    CONSTRAINT fk_pay_stu FOREIGN KEY (student_id)  REFERENCES students(id),
    CONSTRAINT fk_pay_usr FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_pay_invoice (invoice_id),
    INDEX idx_pay_student (student_id),
    INDEX idx_pay_status  (status),
    INDEX idx_pay_date    (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scholarships / concessions
CREATE TABLE scholarships (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    student_id      BIGINT          NOT NULL,
    name            VARCHAR(200)    NOT NULL,
    scholarship_type VARCHAR(30)    DEFAULT 'MERIT' COMMENT 'MERIT, NEED, GOVT, SPORTS, OTHER',
    amount          DECIMAL(12,2)   NOT NULL,
    academic_year   VARCHAR(20)     NOT NULL,
    awarded_date    DATE            NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    remarks         VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_sch_stu FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_sch_student (student_id),
    INDEX idx_sch_year    (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed fee categories
INSERT INTO fee_categories (name, description) VALUES
    ('Tuition',    'Semester tuition fee'),
    ('Exam',       'Examination fee'),
    ('Library',    'Library membership fee'),
    ('Transport',  'Transport service fee'),
    ('Hostel',     'Hostel accommodation fee'),
    ('Misc',       'Miscellaneous college fee');
