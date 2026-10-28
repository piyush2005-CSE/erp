package com.erp.faculty.repository;

import com.erp.faculty.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    Page<Faculty> findByInstitutionType(String institutionType, Pageable pageable);

    @Query("SELECT f FROM Faculty f WHERE " +
           "(:institutionType IS NULL OR f.institutionType = :institutionType) AND " +
           "(:search IS NULL OR LOWER(f.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.employeeId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Faculty> searchFaculty(@Param("institutionType") String institutionType,
                                @Param("search") String search,
                                Pageable pageable);
}
