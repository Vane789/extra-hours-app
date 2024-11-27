package com.example.api_gestion_horas_extra.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApproveRequestDTO {
    private String approverIdentification;
    private String action;
    private LocalDateTime requestDate;
}