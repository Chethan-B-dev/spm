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

    // tested authorization working fine only for admin role
    private final AdminService adminService;

    //tested working fine
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return new ResponseEntity<>(
                adminService.getAllUsers(),
                HttpStatus.OK
        );
    }

    //tested working fine
    @GetMapping("/pending")
    public ResponseEntity<List<AppUser>> getPendingUsers() {
        return new ResponseEntity<>(
                adminService.getPendingUsers(),
                HttpStatus.OK
        );
    }

    //tested working fine
    @GetMapping("/verified")
    public ResponseEntity<List<AppUser>> getVerifiedUsers() {
        return new ResponseEntity<>(
                adminService.getVerifiedUsers(),
                HttpStatus.OK
        );
    }

    //tested working fine
    @GetMapping("/enable/{userId}")
    public ResponseEntity<AppUser> enableUser(@PathVariable Integer userId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminService.enableUser(userId));
    }

    // tested working fine
    @PostMapping("/take-decision")
    public ResponseEntity<AppUser> takeDecision(@RequestBody AdminDecisionDTO adminDecisionDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminService.takeDecision(adminDecisionDTO));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        adminService.deleteUser(userId);
        // todo: make sure to remove all users tasks and all
        return ResponseEntity
                .status(HttpStatus.GONE)
                .build();
    }
}
