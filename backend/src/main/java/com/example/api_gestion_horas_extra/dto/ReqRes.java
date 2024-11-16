package com.example.api_gestion_horas_extra.dto;

import com.example.api_gestion_horas_extra.entity.OurUsers;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String identification;
    private String name;
    private String city;
    private String role;
    private String position;
    private String email;
    private String password;
    private OurUsers ourUsers;
    private List<OurUsers> OurUsersList;
}
