package com.example.api_gestion_horas_extra.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "extrahours", schema = "amadeusbd")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtraHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "startime")
    private LocalTime startime;

    @Column(name = "endtime")
    private LocalTime endtime;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "totalextrahour", precision = 10, scale = 2)
    private BigDecimal totalextrahour;

    @Column(name = "totalpayment", precision = 10, scale = 2)
    private BigDecimal totalpayment;

    @JsonBackReference(value = "user-extrahours")
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "identification", nullable = false)
    private OurUsers users;

    @JsonBackReference(value = "hourtype-extrahours")
    @ManyToOne
    @JoinColumn(name = "extrahourtype", referencedColumnName = "id", nullable = false)
    private HourTypes extrahourtype;

    @JsonBackReference(value = "incident-extrahours")
    @ManyToOne
    @JoinColumn(name = "incident_id", referencedColumnName = "id", nullable = false)
    private Incidents incident;
}
