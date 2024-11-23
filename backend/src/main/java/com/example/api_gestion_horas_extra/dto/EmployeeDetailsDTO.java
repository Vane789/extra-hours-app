package com.example.api_gestion_horas_extra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDetailsDTO {
    private String name;
    private String email;
    private String city;
    private String identification;
    private Double salary;
    private ManagerDTO manager;
}