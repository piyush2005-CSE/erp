package com.erp.student.repository;

import com.erp.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUserId(Long userId);
    Page<Student> findByDepartmentId(Long departmentId, Pageable pageable);
    Page<Student> findByProgramId(Long programId, Pageable pageable);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    long countByStatus(String status);
    Page<Student> findByStatus(String status, Pageable pageable);
    Page<Student> findByInstitutionType(String institutionType, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE " +
           "(:institutionType IS NULL OR s.institutionType = :institutionType) AND " +
           "(:search IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("institutionType") String institutionType,
                                 @Param("search") String search,
                                 Pageable pageable);
}
