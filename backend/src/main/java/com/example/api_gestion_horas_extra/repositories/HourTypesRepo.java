package com.example.api_gestion_horas_extra.repositories;

import com.example.api_gestion_horas_extra.entity.HourTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HourTypesRepo extends JpaRepository<HourTypes, Integer> {

}
