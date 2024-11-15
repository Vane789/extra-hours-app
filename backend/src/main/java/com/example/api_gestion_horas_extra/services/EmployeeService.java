package com.example.api_gestion_horas_extra.services;

import com.example.api_gestion_horas_extra.entity.Employees;
import com.example.api_gestion_horas_extra.repositories.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public Employees addEmployee(Employees employee) {
        return employeeRepository.save(employee);
    }

    public List<Employees> getAllEmployees(){
        return employeeRepository.findAll();
    }

    public Optional<Employees> getEmployeeById(String identification){
        return employeeRepository.findByIdentification(identification);
    }

    public boolean deleteEmployeeByIdentification(String identification) {
        Optional<Employees> employee = employeeRepository.findByIdentification(identification);
        if (employee.isPresent()) {
            employeeRepository.delete(employee.get());
            return true;
        } else {
            return false;
        }
    }

    public Optional<Employees> updateEmployee(String identification, Employees update) {
        Optional<Employees> updateEmployee = employeeRepository.findByIdentification(identification);


        updateEmployee.setEmployee_name(update.getEmployee_name());
        updateEmployee.setEmail(update.getEmail());
        updateEmployee.setPosition(update.getPosition());
        updateEmployee.setSalary(update.getSalary());

        return employeeRepository.save(updateEmployee);
    }
}
