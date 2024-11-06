package com.example.api_gestion_horas_extra.repositories;


import com.example.api_gestion_horas_extra.models.HoraExtra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoraExtraRepository extends JpaRepository<HoraExtra, Long> {
}
