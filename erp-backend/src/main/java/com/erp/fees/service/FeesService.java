package com.erp.fees.service;

import com.erp.fees.dto.CreateInvoiceRequest;
import com.erp.fees.dto.InvoiceDto;
import com.erp.fees.entity.Invoice;
import com.erp.fees.repository.InvoiceRepository;
import com.erp.student.entity.Student;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class FeesService {

    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public InvoiceDto createInvoice(CreateInvoiceRequest request, Long createdBy) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        BigDecimal netAmount = request.getBaseAmount()
                .subtract(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO);

        String invoiceNumber = generateInvoiceNumber();

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .student(student)
                .baseAmount(request.getBaseAmount())
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .netAmount(netAmount)
                .paidAmount(BigDecimal.ZERO)
                .status("UNPAID")
                .issueDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .academicYear(request.getAcademicYear())
                .notes(request.getNotes())
                .createdBy(createdBy)
                .build();

        return mapToDto(invoiceRepository.save(invoice));
    }

    @Transactional(readOnly = true)
    public Page<InvoiceDto> getAllInvoices(String academicYear, String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return invoiceRepository.findByStatus(status, pageable).map(this::mapToDto);
        }
        if (academicYear != null && !academicYear.isBlank()) {
            return invoiceRepository.findByAcademicYear(academicYear, pageable).map(this::mapToDto);
        }
        return invoiceRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceDto> getInvoicesByStudent(Long studentId, Pageable pageable) {
        return invoiceRepository.findByStudentId(studentId, pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public InvoiceDto getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    private String generateInvoiceNumber() {
        String prefix = "INV-" + DateTimeFormatter.ofPattern("yyyyMM").format(LocalDate.now()) + "-";
        long count = invoiceRepository.count() + 1;
        return prefix + String.format("%04d", count);
    }

    private InvoiceDto mapToDto(Invoice i) {
        BigDecimal balance = i.getNetAmount().subtract(i.getPaidAmount());
        return InvoiceDto.builder()
                .id(i.getId())
                .invoiceNumber(i.getInvoiceNumber())
                .studentId(i.getStudent().getId())
                .studentName(i.getStudent().getFirstName() + " " + i.getStudent().getLastName())
                .rollNumber(i.getStudent().getRollNumber())
                .baseAmount(i.getBaseAmount())
                .discountAmount(i.getDiscountAmount())
                .lateFeeAmount(i.getLateFeeAmount())
                .netAmount(i.getNetAmount())
                .paidAmount(i.getPaidAmount())
                .balanceAmount(balance)
                .status(i.getStatus())
                .issueDate(i.getIssueDate())
                .dueDate(i.getDueDate())
                .academicYear(i.getAcademicYear())
                .notes(i.getNotes())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
