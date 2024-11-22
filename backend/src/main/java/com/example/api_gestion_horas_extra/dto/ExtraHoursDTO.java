package com.example.api_gestion_horas_extra.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExtraHoursDTO {
    private LocalDateTime startdatetime;
    private LocalDateTime enddatetime;
    private Double amountextrahours;
    private String comments;
    private Double totalpayment;
    private String userIdentification;
    private String extraHourTypeDescription;
    private String incidentDescription;
}
