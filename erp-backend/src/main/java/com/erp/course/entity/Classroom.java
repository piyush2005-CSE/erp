package com.erp.course.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classrooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @Column(length = 100)
    private String building;

    @Builder.Default
    private Integer floor = 0;

    @Builder.Default
    private Integer capacity = 60;

    @Column(name = "room_type", length = 30)
    @Builder.Default
    private String roomType = "CLASSROOM";

    @Column(name = "has_projector")
    @Builder.Default
    private Boolean hasProjector = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
