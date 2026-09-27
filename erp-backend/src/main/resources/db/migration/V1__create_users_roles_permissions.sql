-- ============================================================
-- V1 – Users, Roles, Permissions (Auth foundation)
-- ============================================================

CREATE TABLE roles (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)     NOT NULL UNIQUE COMMENT 'e.g. SUPER_ADMIN, ADMIN, STUDENT, FACULTY',
    description VARCHAR(255),
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL UNIQUE COMMENT 'e.g. STUDENT_READ, ATTENDANCE_MARK',
    description VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_permissions (
    role_id         BIGINT  NOT NULL,
    permission_id   BIGINT  NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    username            VARCHAR(50)     NOT NULL UNIQUE,
    email               VARCHAR(150)    NOT NULL UNIQUE,
    password_hash       VARCHAR(255)    NOT NULL,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    phone               VARCHAR(20),
    avatar_url          VARCHAR(500),
    is_enabled          BOOLEAN         NOT NULL DEFAULT TRUE,
    is_locked           BOOLEAN         NOT NULL DEFAULT FALSE,
    failed_attempts     INT             NOT NULL DEFAULT 0,
    last_login_at       DATETIME,
    password_changed_at DATETIME,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    user_id     BIGINT      NOT NULL,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expires_at  DATETIME    NOT NULL,
    revoked     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rt_token (token(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed base roles ──────────────────────────────────────────────────────────
INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'Full unrestricted system access'),
    ('ADMIN',       'Campus administrator'),
    ('HOD',         'Head of Department'),
    ('FACULTY',     'Teaching staff'),
    ('ACCOUNTANT',  'Finance and fees'),
    ('LIBRARIAN',   'Library management'),
    ('STUDENT',     'Enrolled student'),
    ('PARENT',      'Parent/Guardian portal'),
    ('HR',          'Human resources');

-- ── Seed permissions ─────────────────────────────────────────────────────────
INSERT INTO permissions (name) VALUES
    ('STUDENT_READ'), ('STUDENT_CREATE'), ('STUDENT_UPDATE'), ('STUDENT_DELETE'),
    ('FACULTY_READ'), ('FACULTY_CREATE'), ('FACULTY_UPDATE'), ('FACULTY_DELETE'),
    ('COURSE_READ'),  ('COURSE_CREATE'),  ('COURSE_UPDATE'),  ('COURSE_DELETE'),
    ('ENROLLMENT_READ'), ('ENROLLMENT_CREATE'), ('ENROLLMENT_UPDATE'),
    ('ATTENDANCE_READ'), ('ATTENDANCE_MARK'),   ('ATTENDANCE_UPDATE'),
    ('RESULT_READ'),  ('RESULT_ENTER'),   ('RESULT_APPROVE'),
    ('FEE_READ'),     ('FEE_CREATE'),     ('FEE_UPDATE'),
    ('PAYMENT_READ'), ('PAYMENT_CREATE'), ('PAYMENT_VERIFY'), ('REFUND_PROCESS'),
    ('LIBRARY_READ'), ('LIBRARY_MANAGE'),
    ('HOSTEL_READ'),  ('HOSTEL_MANAGE'),
    ('TRANSPORT_READ'), ('TRANSPORT_MANAGE'),
    ('USER_READ'),    ('USER_CREATE'),    ('USER_UPDATE'),    ('USER_DELETE'),
    ('REPORT_VIEW'),  ('AUDIT_VIEW');
