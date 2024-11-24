package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.dto.HourTypeDTO;
import com.example.api_gestion_horas_extra.entity.HourTypes;
import com.example.api_gestion_horas_extra.repositories.HourTypesRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HourTypesService {

    private final HourTypesRepo hourTypesRepo;

    public List<HourTypeDTO> getAllHoursTypes() {
        return hourTypesRepo.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public HourTypes addHourType(HourTypes hourType) {
        return hourTypesRepo.save(hourType);
    }

    public void deleteHourType(Integer id) {
        hourTypesRepo.deleteById(id);
    }

    public HourTypes updateHourType(Integer id, HourTypes hourType) {
        HourTypes existingHourType = hourTypesRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hour type with ID " + id + " does not exist."));
        existingHourType.setDescription(hourType.getDescription());
        existingHourType.setPercentage(hourType.getPercentage());

        return hourTypesRepo.save(existingHourType);
    }

    private HourTypeDTO convertToDTO(HourTypes hourTypes) {
        HourTypeDTO hourTypeDTO = new HourTypeDTO();
        BeanUtils.copyProperties(hourTypes, hourTypeDTO);
        return hourTypeDTO;
    }
}
