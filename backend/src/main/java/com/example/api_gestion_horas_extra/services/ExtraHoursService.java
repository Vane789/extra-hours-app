package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.dto.ApproveRequestDTO;
import com.example.api_gestion_horas_extra.dto.ExtraHoursDTO;
import com.example.api_gestion_horas_extra.dto.ExtraHoursUserDTO;
import com.example.api_gestion_horas_extra.entity.*;
import com.example.api_gestion_horas_extra.repositories.ExtraHoursRepo;
import com.example.api_gestion_horas_extra.repositories.HourTypesRepo;
import com.example.api_gestion_horas_extra.repositories.IncidentsRepo;
import com.example.api_gestion_horas_extra.repositories.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
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
            dto.setId(extraHours.getId());
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

    public List<ExtraHoursUserDTO> getExtraHoursUserDTOByUserId(String identification) {
        Optional<OurUsers> user = usersRepo.findByIdentification(identification);
        if (user.isPresent()) {
            List<ExtraHours> extraHoursList = extraHoursRepo.findByUsers_Identification(identification);
            return extraHoursList.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
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

    public Optional<ExtraHours> updateExtraHour(Integer identification, ExtraHoursDTO updatedExtraHour) {
        Optional<ExtraHours> existingExtraHour = extraHoursRepo.findById(identification);
        if (existingExtraHour.isPresent()) {
            ExtraHours extraHour = existingExtraHour.get();
            extraHour.setComments(Optional.ofNullable(updatedExtraHour.getComments()).orElse(extraHour.getComments()));
            extraHour.setTotalextrahour(Optional.ofNullable(updatedExtraHour.getTotalextrahour()).orElse(extraHour.getTotalextrahour()));
            extraHour.setTotalpayment(Optional.ofNullable(updatedExtraHour.getTotalpayment()).orElse(extraHour.getTotalpayment()));

            if (updatedExtraHour.getIncidentId() != null) {
                Optional<Incidents> incident = incidentsRepo.findById(updatedExtraHour.getIncidentId());
                incident.ifPresent(extraHour::setIncident);
            }


            return Optional.of(extraHoursRepo.save(extraHour));
        }
        return Optional.empty();
    }
    public void approveOrRejectExtraHour(Integer extraHourId, ApproveRequestDTO approveRequestDTO) {
        // Buscar la solicitud de horas extra por su ID
        ExtraHours extraHours = extraHoursRepo.findById(extraHourId)
                .orElseThrow(() -> new EntityNotFoundException("Hora extra no encontrada"));

        // Verificar si la acción es aprobar o rechazar
        if ("approve".equalsIgnoreCase(approveRequestDTO.getAction())) {
            // Aprobar la solicitud
            OurUsers approver = usersRepo.findByIdentification(approveRequestDTO.getApproverIdentification())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

            extraHours.approve(approver);
        } else if ("reject".equalsIgnoreCase(approveRequestDTO.getAction())) {
            // Rechazar la solicitud
            OurUsers approver = usersRepo.findByIdentification(approveRequestDTO.getApproverIdentification())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

            extraHours.reject(approver);
        } else {
            throw new IllegalArgumentException("Acción no válida. Debe ser 'approve' o 'reject'.");
        }

        // Guardar el estado actualizado
        extraHoursRepo.save(extraHours);
    }


    // Obtener horas extra pendientes
    public List<ExtraHoursUserDTO> getPendingExtraHours() {
        List<ExtraHours> extraHoursList = extraHoursRepo.findByApprovalStatus(ApprovalStatus.PENDING);
        return extraHoursList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Obtener horas extra aprobadas
    public List<ExtraHoursUserDTO> getApprovedExtraHours() {
        List<ExtraHours> extraHoursList = extraHoursRepo.findByApprovalStatus(ApprovalStatus.APPROVED);
        return extraHoursList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Obtener horas extra rechazadas
    public List<ExtraHoursUserDTO> getRejectedExtraHours() {
        List<ExtraHours> extraHoursList = extraHoursRepo.findByApprovalStatus(ApprovalStatus.REJECTED);
        return extraHoursList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private ExtraHoursUserDTO convertToDTO(ExtraHours extraHours) {
        return new ExtraHoursUserDTO(
                extraHours.getId(),
                extraHours.getUsers().getIdentification(),
                extraHours.getUsers().getName(),
                extraHours.getIncident().getDescription(),
                extraHours.getDate(),
                extraHours.getStartime(),
                extraHours.getEndtime(),
                extraHours.getTotalextrahour(),
                extraHours.getTotalpayment(),
                extraHours.getExtrahourtype().getDescription(),
                extraHours.getComments(),
                extraHours.getApprovalStatus(),
                extraHours.getApprovalDate(),
                extraHours.getApprovedByUser() != null ? extraHours.getApprovedByUser().getIdentification() : null
        );
    }


}
