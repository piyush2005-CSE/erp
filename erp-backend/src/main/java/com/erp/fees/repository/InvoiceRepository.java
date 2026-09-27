package com.erp.fees.repository;

import com.erp.fees.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Page<Invoice> findByStudentId(Long studentId, Pageable pageable);
    Page<Invoice> findByAcademicYear(String academicYear, Pageable pageable);
    Page<Invoice> findByStatus(String status, Pageable pageable);
    boolean existsByInvoiceNumber(String invoiceNumber);

    @Query("SELECT SUM(i.paidAmount) FROM Invoice i WHERE i.academicYear = :year")
    BigDecimal totalCollectedByYear(@Param("year") String year);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(@Param("status") String status);
}
