-- ============================================================
-- V11 – Hostel Management
-- ============================================================

CREATE TABLE hostels (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150)    NOT NULL UNIQUE COMMENT 'e.g. Boys Hostel A, Girls Hostel',
    type        VARCHAR(10)     NOT NULL COMMENT 'BOYS, GIRLS, CO_ED',
    warden_id   BIGINT          COMMENT 'Faculty/Staff user',
    total_rooms INT             NOT NULL DEFAULT 0,
    address     VARCHAR(300),
    phone       VARCHAR(20),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_host_warden FOREIGN KEY (warden_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hostel_rooms (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    hostel_id       BIGINT          NOT NULL,
    room_number     VARCHAR(20)     NOT NULL,
    floor           TINYINT         DEFAULT 0,
    room_type       VARCHAR(20)     DEFAULT 'SHARED' COMMENT 'SINGLE, DOUBLE, TRIPLE, DORM',
    capacity        TINYINT         NOT NULL DEFAULT 2,
    occupied        TINYINT         NOT NULL DEFAULT 0,
    monthly_rent    DECIMAL(10,2)   DEFAULT 0,
    has_ac          BOOLEAN         DEFAULT FALSE,
    has_attached_bath BOOLEAN       DEFAULT TRUE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_room (hostel_id, room_number),
    CONSTRAINT fk_hr_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(id),
    INDEX idx_hr_hostel (hostel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hostel_allocations (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    student_id      BIGINT      NOT NULL,
    room_id         BIGINT      NOT NULL,
    allot_date      DATE        NOT NULL,
    vacate_date     DATE,
    academic_year   VARCHAR(20) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, VACATED, TRANSFERRED',
    remarks         VARCHAR(500),
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ha_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_ha_room    FOREIGN KEY (room_id)    REFERENCES hostel_rooms(id),
    INDEX idx_ha_student (student_id),
    INDEX idx_ha_room    (room_id),
    INDEX idx_ha_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
