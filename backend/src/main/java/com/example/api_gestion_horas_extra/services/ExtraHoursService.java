package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.entity.ExtraHours;
import com.example.api_gestion_horas_extra.repositories.ExtraHoursRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExtraHoursService {
    @Autowired
    private ExtraHoursRepo extraHoursRepo;

    public ExtraHours addExtraHour(ExtraHours extraHour) {
        return extraHoursRepo.save(extraHour);
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
            extraHour.setStartdatetime(updatedExtraHour.getStartdatetime());
            extraHour.setEnddatetime(updatedExtraHour.getEnddatetime());
            extraHour.setAmountextrahours(updatedExtraHour.getAmountextrahours());
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
