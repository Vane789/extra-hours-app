package com.example.api_gestion_horas_extra.repositories;


import com.example.api_gestion_horas_extra.entity.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employees, Long> {
    Optional<Employees> findByIdentification(String identification);
}
