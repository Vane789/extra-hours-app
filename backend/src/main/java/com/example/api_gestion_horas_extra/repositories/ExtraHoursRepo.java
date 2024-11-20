package com.example.api_gestion_horas_extra.repositories;
import com.example.api_gestion_horas_extra.entity.ExtraHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtraHoursRepo extends JpaRepository<ExtraHours, Integer> {

    List<ExtraHours> findByUsers_Identification(String identification);

    List<ExtraHours> findByExtrahourtype_Id(Integer extrahourtypeId);

    List<ExtraHours> findByIncident_Id(Integer incidentId);
}