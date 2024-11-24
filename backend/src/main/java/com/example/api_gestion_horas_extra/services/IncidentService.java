package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.entity.Incidents;
import com.example.api_gestion_horas_extra.repositories.IncidentsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class IncidentService {
    @Autowired
    private IncidentsRepo incidentsRepo;

    public List<Incidents> getAllIncidents() {
        return incidentsRepo.findAll();
    }

    public Incidents createIncident(Incidents incident) {
        return incidentsRepo.save(incident);
    }

    public List<Incidents> searchIncidents(String keyword) {
        return incidentsRepo.findByDescriptionContainingIgnoreCase(keyword);
    }

    public void deleteIncident(String keyword) {
        Incidents incident = incidentsRepo.findFirstByDescriptionContainingIgnoreCase(keyword);
        if (incident != null) {
            incidentsRepo.delete(incident);
        } else {
            throw new RuntimeException("Incidente no encontrado");
        }
    }
}
