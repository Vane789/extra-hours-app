package com.example.api_gestion_horas_extra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtraHoursUserDTO {
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

}
