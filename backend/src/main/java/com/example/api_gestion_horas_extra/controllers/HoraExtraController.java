package com.example.api_gestion_horas_extra.Controller;

import com.example.api_gestion_horas_extra.Model.HoraExtra;
import com.example.api_gestion_horas_extra.Service.HoraExtraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horas-extras")
public class HoraExtraController {
    @Autowired
    private HoraExtraService service;
    @GetMapping
    public List<HoraExtra> listarHorasExtras() {
        return service.obtenerHorasExtras();
    }
    @PostMapping
    public HoraExtra registrarHoraExtra(@RequestBody HoraExtra horaExtra) {
        return service.registrarHoraExtra(horaExtra);
    }
}

