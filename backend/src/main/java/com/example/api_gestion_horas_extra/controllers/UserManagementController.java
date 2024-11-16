package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.dto.ReqRes;
import com.example.api_gestion_horas_extra.entity.OurUsers;
import com.example.api_gestion_horas_extra.entity.Role;
import com.example.api_gestion_horas_extra.services.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserManagementController {

    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes registrationRequest) {
        ReqRes response = usersManagementService.register(registrationRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes loginRequest) {
        ReqRes response = usersManagementService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes refreshTokenRequest) {
        ReqRes response = usersManagementService.refreshToken(refreshTokenRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ReqRes> getAllUsers() {
        ReqRes response = usersManagementService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/users/{identification}")
    public ResponseEntity<ReqRes> getUserByIdentification(@PathVariable String identification) {
        ReqRes response = usersManagementService.getUserByIdentification(identification);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/admin/users/{identification}")
    public ResponseEntity<ReqRes> updateUser(
            @PathVariable String identification,
            @RequestBody OurUsers updatedUser) {
        ReqRes response = usersManagementService.updateUserByIdentification(identification, updatedUser);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/users/{identification}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable String identification) {
        ReqRes response = usersManagementService.deleteUserByIdentification(identification);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/adminuser/profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

//    @PutMapping("/user/profile")
//    public ResponseEntity<ReqRes> updateMyProfile(@RequestBody OurUsers updatedUser) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();
//        ReqRes userInfo = usersManagementService.getMyInfo(email);
//
//        if (userInfo.getStatusCode() == 200 && userInfo.getOurUsers() != null) {
//            String identification = userInfo.getOurUsers().getIdentification();
//            ReqRes response = usersManagementService.updateUserByIdentification(identification, updatedUser);
//            return ResponseEntity.status(response.getStatusCode()).body(response);
//        }
//
//        return ResponseEntity.status(404).body(userInfo);
//    }
}