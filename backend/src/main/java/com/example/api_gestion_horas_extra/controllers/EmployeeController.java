package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.entity.Employees;
import com.example.api_gestion_horas_extra.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/addEmployee")
    public ResponseEntity<Employees> addEmployee(@RequestBody Employees employee) {
        Employees addedEmployee = employeeService.addEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedEmployee);
    }

    @GetMapping("/getAllEmployees")
    public List<Employees> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/getEmployeeById/{identification}")
    public ResponseEntity<Employees> getEmployeeById(@PathVariable String identification) {
        Optional<Employees> employee = employeeService.getEmployeeById(identification);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deleteEmployee/{identification}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String identification) {
        Optional<Employees> employee = employeeService.getEmployeeById(identification);
        if (employee.isPresent()) {
            employeeService.deleteEmployeeByIdentification(identification);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateEmployee/{identification}")
    public ResponseEntity<Employees> updateEmployee(@PathVariable String identification, @RequestBody Employees employee) {
        Optional<Employees> updatedEmployee = employeeService.updateEmployee(identification, employee);

        if (updatedEmployee.isPresent()) {
            return new ResponseEntity<>(updatedEmployee.get(), HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}