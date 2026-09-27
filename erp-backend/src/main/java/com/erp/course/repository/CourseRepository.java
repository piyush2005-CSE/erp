package com.erp.course.repository;

import com.erp.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCode(String code);
    Optional<Course> findByCode(String code);

    @Query("SELECT c FROM Course c WHERE c.department.id = :deptId")
    Page<Course> findByDepartmentId(@Param("deptId") Long deptId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> search(@Param("search") String search, Pageable pageable);
    
    long countByIsActive(boolean isActive);
}
