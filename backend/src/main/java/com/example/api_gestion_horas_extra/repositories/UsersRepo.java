package com.example.api_gestion_horas_extra.repositories;

import com.example.api_gestion_horas_extra.entity.OurUsers;
import com.example.api_gestion_horas_extra.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers, Integer> {

    Optional<OurUsers> findByEmail(String email);

//    Optional<OurUsers> findByName(String name);
    Optional<OurUsers> findByIdentification(String identification);
//    List<OurUsers> findByRole(Role role);

}