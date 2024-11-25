package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.dto.IncidentDTO;
import com.example.api_gestion_horas_extra.services.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentsController {
    @Autowired
    private IncidentService incidentService;

    @GetMapping
    public ResponseEntity<List<IncidentDTO>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @PostMapping
    public ResponseEntity<IncidentDTO> createIncident(@RequestBody IncidentDTO incidentDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.createIncident(incidentDTO));
    }

    @GetMapping("/search")
    public ResponseEntity<List<IncidentDTO>> searchIncidents(@RequestParam String keyword) {
        return ResponseEntity.ok(incidentService.searchIncidents(keyword));
    }

    @DeleteMapping("/delete/{keyword}")
    public ResponseEntity<String> deleteIncident(@PathVariable String keyword) {
        try {
            incidentService.deleteIncident(keyword);
            return ResponseEntity.ok("Incidente eliminado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incidente no encontrado.");
        }
    }
}