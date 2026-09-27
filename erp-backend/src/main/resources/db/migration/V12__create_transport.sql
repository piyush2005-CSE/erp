-- ============================================================
-- V12 – Transport Management
-- ============================================================

CREATE TABLE transport_routes (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    route_name      VARCHAR(150)    NOT NULL,
    route_number    VARCHAR(20)     NOT NULL UNIQUE,
    start_point     VARCHAR(200)    NOT NULL,
    end_point       VARCHAR(200)    NOT NULL,
    distance_km     DECIMAL(8,2),
    monthly_fee     DECIMAL(10,2)   NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE route_stops (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    route_id        BIGINT          NOT NULL,
    stop_name       VARCHAR(200)    NOT NULL,
    stop_order      TINYINT         NOT NULL,
    arrival_time    TIME,
    departure_time  TIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_rs_route FOREIGN KEY (route_id) REFERENCES transport_routes(id),
    INDEX idx_rs_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicles (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    vehicle_number  VARCHAR(30)     NOT NULL UNIQUE,
    vehicle_type    VARCHAR(30)     DEFAULT 'BUS' COMMENT 'BUS, MINI_BUS, VAN',
    make_model      VARCHAR(100),
    capacity        INT             NOT NULL DEFAULT 40,
    driver_name     VARCHAR(100),
    driver_phone    VARCHAR(20),
    route_id        BIGINT,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_veh_route FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transport_subscriptions (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    student_id      BIGINT          NOT NULL,
    route_id        BIGINT          NOT NULL,
    stop_id         BIGINT,
    academic_year   VARCHAR(20)     NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_ts (student_id, route_id, academic_year),
    CONSTRAINT fk_ts_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_ts_route   FOREIGN KEY (route_id)   REFERENCES transport_routes(id),
    CONSTRAINT fk_ts_stop    FOREIGN KEY (stop_id)    REFERENCES route_stops(id) ON DELETE SET NULL,
    INDEX idx_ts_student (student_id),
    INDEX idx_ts_route   (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
