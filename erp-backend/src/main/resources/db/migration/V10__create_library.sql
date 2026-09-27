-- ============================================================
-- V10 – Library Management
-- ============================================================

CREATE TABLE library_books (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    isbn            VARCHAR(20)     UNIQUE,
    title           VARCHAR(500)    NOT NULL,
    author          VARCHAR(300)    NOT NULL,
    publisher       VARCHAR(200),
    publication_year YEAR,
    edition         VARCHAR(50),
    category        VARCHAR(100),
    subject         VARCHAR(200),
    language        VARCHAR(50)     DEFAULT 'English',
    total_copies    INT             NOT NULL DEFAULT 1,
    available_copies INT            NOT NULL DEFAULT 1,
    location        VARCHAR(100)    COMMENT 'Shelf/rack location',
    description     TEXT,
    cover_url       VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_book_isbn  (isbn),
    INDEX idx_book_title (title(100)),
    FULLTEXT idx_book_search (title, author, subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_copies (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    book_id     BIGINT          NOT NULL,
    barcode     VARCHAR(50)     NOT NULL UNIQUE,
    condition   VARCHAR(20)     DEFAULT 'GOOD' COMMENT 'GOOD, FAIR, POOR, LOST, DAMAGED',
    is_available BOOLEAN        NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_bc_book FOREIGN KEY (book_id) REFERENCES library_books(id),
    INDEX idx_bc_book    (book_id),
    INDEX idx_bc_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE borrowing_records (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    copy_id         BIGINT      NOT NULL,
    book_id         BIGINT      NOT NULL,
    borrower_user_id BIGINT     NOT NULL COMMENT 'Student or faculty user',
    issue_date      DATE        NOT NULL,
    due_date        DATE        NOT NULL,
    return_date     DATE,
    fine_amount     DECIMAL(8,2) NOT NULL DEFAULT 0,
    fine_paid       BOOLEAN     NOT NULL DEFAULT FALSE,
    status          VARCHAR(20) NOT NULL DEFAULT 'ISSUED' COMMENT 'ISSUED, RETURNED, OVERDUE, LOST',
    issued_by       BIGINT      NOT NULL COMMENT 'Librarian user ID',
    returned_to     BIGINT,
    remarks         VARCHAR(500),
    PRIMARY KEY (id),
    CONSTRAINT fk_br_copy    FOREIGN KEY (copy_id)         REFERENCES book_copies(id),
    CONSTRAINT fk_br_book    FOREIGN KEY (book_id)         REFERENCES library_books(id),
    CONSTRAINT fk_br_user    FOREIGN KEY (borrower_user_id) REFERENCES users(id),
    CONSTRAINT fk_br_issued  FOREIGN KEY (issued_by)       REFERENCES users(id),
    CONSTRAINT fk_br_retd    FOREIGN KEY (returned_to)     REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_br_borrower (borrower_user_id),
    INDEX idx_br_status   (status),
    INDEX idx_br_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
