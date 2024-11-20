package com.example.api_gestion_horas_extra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "extrahours", schema = "amadeusbd")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtraHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hourprice")
    private BigDecimal hourprice;

    @Column(name = "startdatetime")
    private LocalDateTime startdatetime;

    @Column(name = "enddatetime")
    private LocalDateTime enddatetime;

    @Column(name = "amountextrahours", precision = 5, scale = 2)
    private BigDecimal amountextrahours;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "totalextrahour", precision = 10, scale = 2)
    private BigDecimal totalextrahour;

    @Column(name = "totalpayment", precision = 10, scale = 2)
    private BigDecimal totalpayment;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "identification", nullable = false)
    private OurUsers users;

    @ManyToOne
    @JoinColumn(name = "extrahourtype", referencedColumnName = "id", nullable = false)
    private HourTypes extrahourtype;

    @ManyToOne
    @JoinColumn(name = "incident_id", referencedColumnName = "id", nullable = false)
    private Incidents incident;
}
