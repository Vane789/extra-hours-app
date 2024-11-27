package com.example.api_gestion_horas_extra.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ExtraHoursDTO {
    private String date;
    private String startime;
    private String endtime;
    private String comments;
    private BigDecimal totalextrahour;
    private BigDecimal totalpayment;
    private String identification;
    private Integer incidentId;
    private Integer extrahourtype;
}
