package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.entity.HourTypes;
import com.example.api_gestion_horas_extra.repositories.HourTypesRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.api_gestion_horas_extra.dto.HourTypeDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HourTypesService {

    @Autowired
    private final HourTypesRepo hourTypesRepo;

    public List<HourTypeDTO> getAllHoursTypes(){

        return hourTypesRepo.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private HourTypeDTO convertToDTO(HourTypes hourTypes){
        HourTypeDTO hourTypeDTO = new HourTypeDTO();
        BeanUtils.copyProperties(hourTypes,hourTypeDTO);
        return hourTypeDTO;
    }
}