-- ============================================================
-- V14 – Audit Logs
-- ============================================================

CREATE TABLE audit_logs (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          COMMENT 'Who performed the action (NULL = system)',
    action          VARCHAR(100)    NOT NULL COMMENT 'e.g. LOGIN, CREATE_STUDENT, DELETE_COURSE',
    entity_type     VARCHAR(100)    COMMENT 'e.g. Student, Invoice, Course',
    entity_id       VARCHAR(100)    COMMENT 'PK of the affected record',
    old_values      JSON            COMMENT 'Before state (for updates)',
    new_values      JSON            COMMENT 'After state (for creates/updates)',
    ip_address      VARCHAR(50),
    user_agent      VARCHAR(500),
    request_uri     VARCHAR(500),
    request_method  VARCHAR(10),
    status          VARCHAR(20)     DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILURE, DENIED',
    error_message   VARCHAR(1000),
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_al_user      (user_id),
    INDEX idx_al_action    (action),
    INDEX idx_al_entity    (entity_type, entity_id),
    INDEX idx_al_created   (created_at),
    INDEX idx_al_status    (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
