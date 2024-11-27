package com.example.api_gestion_horas_extra.dto;

import com.example.api_gestion_horas_extra.entity.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtraHoursUserDTO {
    private Integer id;
    private String identification;
    private String name;
    private String incident;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal totalExtraHour;
    private BigDecimal totalPayment;
    private String extraHourType;
    private String comments;
    private ApprovalStatus approvalStatus;
    private LocalDateTime approvalDate;
    private String approvedByUserIdentification;

}
