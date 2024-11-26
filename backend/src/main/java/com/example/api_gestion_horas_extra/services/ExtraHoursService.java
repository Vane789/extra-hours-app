package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.dto.ExtraHoursDTO;
import com.example.api_gestion_horas_extra.dto.ExtraHoursUserDTO;
import com.example.api_gestion_horas_extra.entity.ExtraHours;
import com.example.api_gestion_horas_extra.entity.HourTypes;
import com.example.api_gestion_horas_extra.entity.Incidents;
import com.example.api_gestion_horas_extra.entity.OurUsers;
import com.example.api_gestion_horas_extra.repositories.ExtraHoursRepo;
import com.example.api_gestion_horas_extra.repositories.HourTypesRepo;
import com.example.api_gestion_horas_extra.repositories.IncidentsRepo;
import com.example.api_gestion_horas_extra.repositories.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExtraHoursService {
    @Autowired
    private ExtraHoursRepo extraHoursRepo;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private HourTypesRepo hourTypesRepo;
    @Autowired
    private IncidentsRepo incidentsRepo;

    public List<ExtraHoursUserDTO> generateReport(){
        List<ExtraHours> extraHoursList = extraHoursRepo.findAll();
        return extraHoursList.stream().map(extraHours -> {
            ExtraHoursUserDTO dto = new ExtraHoursUserDTO();
            dto.setIdentification(extraHours.getUsers().getIdentification());
            dto.setName(extraHours.getUsers().getName());
            dto.setIncident(extraHours.getIncident().getDescription());
            dto.setDate(extraHours.getDate());
            dto.setStartTime(extraHours.getStartime());
            dto.setEndTime(extraHours.getEndtime());
            dto.setTotalExtraHour(extraHours.getTotalextrahour());
            dto.setTotalPayment(extraHours.getTotalpayment());
            dto.setExtraHourType(extraHours.getExtrahourtype().getDescription());
            dto.setComments(extraHours.getComments());

            return dto;
        }).collect(Collectors.toList());
    }

    public ExtraHours convertDtoToEntity(ExtraHoursDTO extraHoursDTO) {
        ExtraHours extraHours = new ExtraHours();

        extraHours.setDate(LocalDate.parse(extraHoursDTO.getDate()));
        extraHours.setStartime(LocalTime.parse(extraHoursDTO.getStartime()));
        extraHours.setEndtime(LocalTime.parse(extraHoursDTO.getEndtime()));
        extraHours.setComments(extraHoursDTO.getComments());
        extraHours.setTotalextrahour(extraHoursDTO.getTotalextrahour());
        extraHours.setTotalpayment(extraHoursDTO.getTotalpayment());

        OurUsers user = usersRepo.findByIdentification(extraHoursDTO.getIdentification())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        extraHours.setUsers(user);

        HourTypes hourType = hourTypesRepo.findById(extraHoursDTO.getExtrahourtype())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de hora extra no encontrado"));
        extraHours.setExtrahourtype(hourType);

        Incidents incident = incidentsRepo.findById(extraHoursDTO.getIncidentId())
                .orElseThrow(() -> new EntityNotFoundException("Incidente no encontrado"));
        extraHours.setIncident(incident);

        return extraHours;
    }

    public ExtraHours addExtraHour(ExtraHoursDTO extraHoursDTO) {
        ExtraHours extraHours = convertDtoToEntity(extraHoursDTO);

        return extraHoursRepo.save(extraHours);
    }

    public List<ExtraHours> getAllExtraHours() {
        return extraHoursRepo.findAll();
    }

    public Optional<ExtraHours> getExtraHourById(Integer id) {
        return extraHoursRepo.findById(id);
    }

    public List<ExtraHours> getExtraHoursByUserIdentification(String identification) {
        return extraHoursRepo.findByUsers_Identification(identification);
    }

    public List<ExtraHours> getExtraHoursByHourType(Integer hourTypeId) {
        return extraHoursRepo.findByExtrahourtype_Id(hourTypeId);
    }

    public List<ExtraHours> getExtraHoursByIncident(Integer incidentId) {
        return extraHoursRepo.findByIncident_Id(incidentId);
    }

    public boolean deleteExtraHourById(Integer id) {
        if (extraHoursRepo.existsById(id)) {
            extraHoursRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<ExtraHours> updateExtraHour(Integer id, ExtraHours updatedExtraHour) {
        Optional<ExtraHours> existingExtraHour = extraHoursRepo.findById(id);
        if (existingExtraHour.isPresent()) {
            ExtraHours extraHour = existingExtraHour.get();
            extraHour.setDate(updatedExtraHour.getDate());
            extraHour.setStartime(updatedExtraHour.getStartime());
            extraHour.setEndtime(updatedExtraHour.getEndtime());
            extraHour.setComments(updatedExtraHour.getComments());
            extraHour.setTotalextrahour(updatedExtraHour.getTotalextrahour());
            extraHour.setTotalpayment(updatedExtraHour.getTotalpayment());
            extraHour.setUsers(updatedExtraHour.getUsers());
            extraHour.setExtrahourtype(updatedExtraHour.getExtrahourtype());
            extraHour.setIncident(updatedExtraHour.getIncident());
            return Optional.of(extraHoursRepo.save(extraHour));
        }
        return Optional.empty();
    }

}
