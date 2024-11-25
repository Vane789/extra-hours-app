package com.example.api_gestion_horas_extra.repositories;

import com.example.api_gestion_horas_extra.entity.Incidents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentsRepo extends JpaRepository<Incidents, Integer> {
    List<Incidents> findByDescriptionContainingIgnoreCase(String keyword);
    Incidents findFirstByDescriptionContainingIgnoreCase(String keyword);
}