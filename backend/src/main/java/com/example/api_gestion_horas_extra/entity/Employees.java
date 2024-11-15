package com.example.api_gestion_horas_extra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employees")

public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identification", unique = true)
    private String identification;

    @Column(name = "employee_name")
    private String employee_name;

    @Column(name = "email")
    private String email;

    @Column(name = "position")
    private String position;

    @Column(name = "salary")
    private String salary;



}
