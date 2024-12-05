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
@Table(name = "extrahours")
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

    @Column(name = "approve")
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @ManyToOne
    @JoinColumn(name = "approved_by_user_id")
    private OurUsers approvedByUser;

    // Método de utilidad para establecer la aprobación
    public void approve(OurUsers approver) {
        this.approvalStatus = ApprovalStatus.APPROVED;
        this.approvalDate = LocalDateTime.now();
        this.approvedByUser = approver;
    }

    // Método de utilidad para rechazar
    public void reject(OurUsers approver) {
        this.approvalStatus = ApprovalStatus.REJECTED;
        this.approvalDate = LocalDateTime.now();
        this.approvedByUser = approver;
    }

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
