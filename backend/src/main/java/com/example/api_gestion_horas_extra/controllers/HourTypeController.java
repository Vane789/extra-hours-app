package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.dto.HourTypeDTO;
import com.example.api_gestion_horas_extra.entity.HourTypes;
import com.example.api_gestion_horas_extra.services.HourTypesService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hourtypes")
@AllArgsConstructor
public class HourTypeController {

    private final HourTypesService hourTypesService;

    @GetMapping
    public ResponseEntity<List<HourTypeDTO>> getAllHourTypes() {
        List<HourTypeDTO> hourTypes = hourTypesService.getAllHoursTypes();
        return ResponseEntity.ok(hourTypes);
    }

    @PostMapping
    public ResponseEntity<HourTypes> addHourType(@RequestBody HourTypes hourType) {
        HourTypes createdHourType = hourTypesService.addHourType(hourType);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHourType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHourType(@PathVariable Integer id) {
        hourTypesService.deleteHourType(id);
        return ResponseEntity.ok("Hour type with ID " + id + " deleted successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<HourTypes> updateHourType(@PathVariable Integer id, @RequestBody HourTypes hourType) {
        HourTypes updatedHourType = hourTypesService.updateHourType(id, hourType);
        return ResponseEntity.ok(updatedHourType);
    }
}
