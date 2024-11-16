package com.example.api_gestion_horas_extra.entity;

public enum Role {
    ADMIN,
    MANAGER,
    USER;

    public String getValue() {
        return this.name();
    }

}
