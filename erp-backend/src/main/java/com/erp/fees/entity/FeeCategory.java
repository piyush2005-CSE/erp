package com.erp.fees.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fee_categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
