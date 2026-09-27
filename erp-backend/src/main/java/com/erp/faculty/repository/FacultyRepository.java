package com.erp.faculty.repository;

import com.erp.faculty.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    Optional<Faculty> findByEmail(String email);
    Optional<Faculty> findByUserId(Long userId);
    Page<Faculty> findByDepartmentId(Long departmentId, Pageable pageable);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    long countByStatus(String status);
    Page<Faculty> findByStatus(String status, Pageable pageable);
}
