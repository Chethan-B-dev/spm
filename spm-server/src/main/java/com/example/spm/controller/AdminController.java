package com.example.spm.controller;

import com.example.spm.model.dto.AdminDecisionDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return new ResponseEntity<>(
                adminService.getAllUsers(),
                HttpStatus.OK
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AppUser>> getPendingUsers() {
        return new ResponseEntity<>(
                adminService.getPendingUsers(),
                HttpStatus.OK
        );
    }

    @GetMapping("/verified")
    public ResponseEntity<List<AppUser>> getVerifiedUsers() {
        return new ResponseEntity<>(
                adminService.getVerifiedUsers(),
                HttpStatus.OK
        );
    }

    @GetMapping("/enable/{userId}")
    public ResponseEntity<AppUser> enableUser(@PathVariable Integer userId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminService.enableUser(userId));
    }

    @PostMapping("/take-decision")
    public ResponseEntity<AppUser> takeDecision(@RequestBody AdminDecisionDTO adminDecisionDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminService.takeDecision(adminDecisionDTO));
    }
}
