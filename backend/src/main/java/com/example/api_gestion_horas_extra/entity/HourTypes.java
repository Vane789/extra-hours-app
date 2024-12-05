package com.example.api_gestion_horas_extra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "hourtypes")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HourTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "description", nullable = false, length = 50)
    private String description;

    @Column(name = "percentage", nullable = false, precision = 10, scale = 2)
    private BigDecimal percentage;
}
