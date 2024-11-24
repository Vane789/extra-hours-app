package com.example.api_gestion_horas_extra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HourTypeDTO {
    private Integer id;
    private String description;
    private BigDecimal percentage;
}

