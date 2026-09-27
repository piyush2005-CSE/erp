-- ============================================================
-- V13 – Notifications & Documents
-- ============================================================

CREATE TABLE notifications (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    title           VARCHAR(300)    NOT NULL,
    message         TEXT            NOT NULL,
    notification_type VARCHAR(30)   NOT NULL DEFAULT 'GENERAL'
                    COMMENT 'GENERAL, EXAM, FEE, ATTENDANCE, RESULT, SYSTEM',
    sender_id       BIGINT          NOT NULL COMMENT 'User who sent',
    target_type     VARCHAR(20)     NOT NULL DEFAULT 'ALL'
                    COMMENT 'ALL, STUDENTS, FACULTY, DEPARTMENT, INDIVIDUAL',
    target_dept_id  BIGINT          COMMENT 'If target_type=DEPARTMENT',
    target_user_id  BIGINT          COMMENT 'If target_type=INDIVIDUAL',
    is_published    BOOLEAN         NOT NULL DEFAULT TRUE,
    publish_date    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notif_sender  FOREIGN KEY (sender_id)      REFERENCES users(id),
    CONSTRAINT fk_notif_dept    FOREIGN KEY (target_dept_id)  REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_notif_user    FOREIGN KEY (target_user_id)  REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_notif_type    (notification_type),
    INDEX idx_notif_target  (target_type),
    INDEX idx_notif_publish (publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-user read receipts
CREATE TABLE notification_reads (
    notification_id BIGINT      NOT NULL,
    user_id         BIGINT      NOT NULL,
    read_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id, user_id),
    CONSTRAINT fk_nr_notif FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    CONSTRAINT fk_nr_user  FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE documents (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    owner_user_id   BIGINT          NOT NULL COMMENT 'Who owns this document',
    document_type   VARCHAR(50)     NOT NULL COMMENT 'ADMISSION_LETTER, ID_CARD, RESULT, RECEIPT, CERTIFICATE, OTHER',
    file_name       VARCHAR(255)    NOT NULL,
    original_name   VARCHAR(255)    NOT NULL,
    content_type    VARCHAR(100)    NOT NULL,
    file_size_bytes BIGINT,
    storage_path    VARCHAR(1000)   NOT NULL COMMENT 'GCS key or local path',
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    verified_by     BIGINT,
    verified_at     DATETIME,
    is_public       BOOLEAN         NOT NULL DEFAULT FALSE,
    description     VARCHAR(500),
    uploaded_by     BIGINT          NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_doc_owner    FOREIGN KEY (owner_user_id) REFERENCES users(id),
    CONSTRAINT fk_doc_verifier FOREIGN KEY (verified_by)   REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by)   REFERENCES users(id),
    INDEX idx_doc_owner (owner_user_id),
    INDEX idx_doc_type  (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
