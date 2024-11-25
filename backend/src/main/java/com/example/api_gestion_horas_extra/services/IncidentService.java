package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.dto.IncidentDTO;
import com.example.api_gestion_horas_extra.entity.Incidents;
import com.example.api_gestion_horas_extra.repositories.IncidentsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {
    @Autowired
    private IncidentsRepo incidentsRepo;

    public List<IncidentDTO> getAllIncidents() {
        return incidentsRepo.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncidentDTO createIncident(IncidentDTO incidentDTO) {
        Incidents incident = convertToEntity(incidentDTO);
        Incidents savedIncident = incidentsRepo.save(incident);
        return convertToDTO(savedIncident);
    }

    public List<IncidentDTO> searchIncidents(String keyword) {
        return incidentsRepo.findByDescriptionContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteIncident(String keyword) {
        Incidents incident = incidentsRepo.findFirstByDescriptionContainingIgnoreCase(keyword);
        if (incident != null) {
            incidentsRepo.delete(incident);
        } else {
            throw new RuntimeException("Incidente no encontrado");
        }
    }

    private IncidentDTO convertToDTO(Incidents incident) {
        return new IncidentDTO(
                incident.getId(),
                incident.getDescription(),
                incident.getCreatedAt()
        );
    }

    private Incidents convertToEntity(IncidentDTO dto) {
        Incidents incident = new Incidents();
        incident.setId(dto.getId());
        incident.setDescription(dto.getDescription());
        incident.setCreatedAt(dto.getCreatedAt());
        return incident;
    }
}
