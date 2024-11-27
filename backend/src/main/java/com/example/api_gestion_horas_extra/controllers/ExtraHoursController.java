package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.dto.ApproveRequestDTO;
import com.example.api_gestion_horas_extra.dto.ExtraHoursDTO;
import com.example.api_gestion_horas_extra.dto.ExtraHoursUserDTO;
import com.example.api_gestion_horas_extra.entity.ApprovalStatus;
import com.example.api_gestion_horas_extra.entity.ExtraHours;
import com.example.api_gestion_horas_extra.entity.OurUsers;
import com.example.api_gestion_horas_extra.services.ExtraHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/extrahours")
public class ExtraHoursController {
    @Autowired
    private ExtraHoursService extraHoursService;
    @PostMapping
    public ResponseEntity<ExtraHours> addExtraHour(@RequestBody ExtraHoursDTO extraHourDTO) {
        System.out.println("extraHour JSON" + extraHourDTO.toString());
        System.out.println("consumiendooooo");
        return ResponseEntity.status(HttpStatus.CREATED).body(extraHoursService.addExtraHour(extraHourDTO));
    }

    @GetMapping
    public ResponseEntity<List<ExtraHours>> getAllExtraHours() {
        return ResponseEntity.ok(extraHoursService.getAllExtraHours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExtraHours> getExtraHourById(@PathVariable Integer id) {
        return extraHoursService.getExtraHourById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ExtraHoursUserDTO>> getUserExtraHoursHistory(@RequestParam String identification) {
        List<ExtraHoursUserDTO> extraHours = extraHoursService.getExtraHoursUserDTOByUserId(identification);
        return ResponseEntity.ok(extraHours);
    }

    @GetMapping("/hourtype/{hourTypeId}")
    public ResponseEntity<List<ExtraHours>> getExtraHoursByHourType(@PathVariable Integer hourTypeId) {
        return ResponseEntity.ok(extraHoursService.getExtraHoursByHourType(hourTypeId));
    }

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<ExtraHours>> getExtraHoursByIncident(@PathVariable Integer incidentId) {
        return ResponseEntity.ok(extraHoursService.getExtraHoursByIncident(incidentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExtraHours> updateExtraHour(@PathVariable Integer id, @RequestBody ExtraHoursDTO updatedExtraHour) {
        return extraHoursService.updateExtraHour(id, updatedExtraHour)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExtraHour(@PathVariable Integer id) {
        boolean deleted = extraHoursService.deleteExtraHourById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/report")
    public ResponseEntity<List<ExtraHoursUserDTO>> getExtraHoursReport() {
        List<ExtraHoursUserDTO> reportData = extraHoursService.generateReport();
        return ResponseEntity.ok(reportData);
    }


    @PostMapping("/approve-or-reject/{id}")
    public ResponseEntity<String> approveOrRejectExtraHour(
            @PathVariable("id") Integer id,
            @RequestBody ApproveRequestDTO approveRequestDTO) {

        try {
            extraHoursService.approveOrRejectExtraHour(id, approveRequestDTO);
            return ResponseEntity.ok("La solicitud ha sido procesada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al procesar la solicitud: " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<ExtraHoursUserDTO> getPendingExtraHours() {
        return extraHoursService.getPendingExtraHours();
    }

    @GetMapping("/approved")
    public List<ExtraHoursUserDTO> getApprovedExtraHours() {
        return extraHoursService.getApprovedExtraHours();
    }

    @GetMapping("/rejected")
    public List<ExtraHoursUserDTO> getRejectedExtraHours() {
        return extraHoursService.getRejectedExtraHours();
    }

}
